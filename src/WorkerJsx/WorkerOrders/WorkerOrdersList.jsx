import { useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "../../CommonJsx/SupabaseClient";
import { DataContext } from "../../CommonJsx/DataContext";
const WorkerOrdersList = ({ setActivePanel, setSelectedOrder }) => {
  const [orders, setOrders] = useState([]);
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
    <>
      {orders.length > 0 ? <h4>Click to see the details</h4> : null}
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => {
            return (
              <li
                onClick={() => {
                  setSelectedOrder(order);
                  setActivePanel;
                }}
                key={order.id}
              >
                <p>{order.Title}</p>
                <p>{order.FinalDate}</p>
              </li>
            );
          })
        ) : (
          <li>No orders found.</li>
        )}
      </ul>
    </>
  );
};

export default WorkerOrdersList;
