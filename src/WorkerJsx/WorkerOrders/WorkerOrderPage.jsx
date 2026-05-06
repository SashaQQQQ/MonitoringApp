import { useState, useEffect, useContext } from "react";
import "../../Styles/WorkerOrderPage.css";
import { supabase } from "../../CommonJsx/SupabaseClient";
import { DataContext } from "../../CommonJsx/DataContext";
import WorkerOrdersList from "./WorkerOrdersList.jsx";
import WorkerOrderDetails from "./WorkerOrderDetails.jsx";

function WorkerOrdersPage({}) {
  const [selectedOrder, setSelectedOrder] = useState({});
  const [activePanel, setActivePanel] = useState("list");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!selectedOrder.id) return;

    const updatedOrder = orders.find((order) => {
      return order?.order_id === selectedOrder?.order_id;
    });

    if (updatedOrder && updatedOrder !== selectedOrder) {
      setSelectedOrder(updatedOrder);
    }
  }, [orders]);

  const { userProfile } = useContext(DataContext);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("order.Workers")
      .select("*")
      .eq("worker_id", userProfile.id);

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      const orderIds = data.map((ow) => ow.order_id);

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .in("id", orderIds);
      if (ordersError) {
        console.error("Error fetching orders details:", ordersError);
      }
      const combinedOrdersData = await Promise.all(
        (ordersData || []).map(async (order) => {
          const ReadyProcent = await calcAverageProgress(order);
          const today = new Date();
          const finalDate = new Date(order.FinalDate);
          const timeLeft = Math.ceil(
            (finalDate - today) / (1000 * 60 * 60 * 24),
          );
          const workerOrder = data.find((ow) => ow.order_id === order.id);
          return {
            ...order,
            timeLeft: timeLeft,
            averageProgress: ReadyProcent,
            myProgress: workerOrder?.progress_percent ?? 0,
            myRole: workerOrder?.Role ?? "",
          };
        }),
      );
      setOrders(combinedOrdersData);
    }
  }

  async function calcAverageProgress(order) {
    if (!order.id) return 0;
    const { data, error } = await supabase
      .from("order.Workers")
      .select("progress_percent")
      .eq("order_id", order.id);
    if (error) {
      console.error("Error fetching progress data:", error);
      return 0;
    }

    const totalProgress = data.reduce(
      (sum, worker) => sum + worker.progress_percent,
      0,
    );
    return Math.round(totalProgress / data.length);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="workerOrdersPage">
      <div
        className={`orderColumn ${activePanel === "details" ? "hidden" : ""}`}
      >
        <WorkerOrdersList
          orders={orders}
          setOrders={setOrders}
          setActivePanel={setActivePanel}
          setSelectedOrder={setSelectedOrder}
        />
      </div>
      <div className={`orderColumn ${activePanel === "list" ? "hidden" : ""}`}>
        <WorkerOrderDetails
          fetchOrders={fetchOrders}
          setActivePanel={setActivePanel}
          selectedOrder={selectedOrder}
        />
      </div>
    </div>
  );
}

export default WorkerOrdersPage;
