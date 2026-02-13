import { useState, useEffect, use } from "react";
import DonutChart from "../CommonJsx/DonutChart.jsx";
import "../Styles/OrdersPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";

function WorkerOrdersPage({ userProfile, SetActivePage }) {
  const [ordersId, setOrdersId] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchingOrderId, setSearchingOrderId] = useState(null);
  const [progress, setProgress] = useState(null);
  const [updateFieldStatus, setUpdateFieldStatus] = useState(false);
  const [updatedProgress, setUpdatedProgress] = useState(null);

  useEffect(() => {
    fetchOrderProgress();
  }, [searchingOrderId]);

  function hadleProgressChange(e) {
    if (e.target.value < 0 || e.target.value > 100) {
      alert("Please enter a valid progress percentage between 0 and 100.");
      return;
    }
    setUpdatedProgress(e.target.value);
  }
  async function updateProgress() {
    console.log(
      "Updating progress to:",
      updatedProgress,
      "for order ID:",
      searchingOrderId,
      "and worker ID:",
      userProfile[0].id,
    );
    const { data, error } = await supabase
      .from("order.Workers")
      .update({ progress_percent: updatedProgress })
      .eq("order_id", searchingOrderId)
      .eq("worker_id", userProfile[0].id);

    if (error) {
      console.error("Error updating progress:", error);
    } else {
      console.log("Progress updated successfully:", data);
    }
  }
  async function fetchOrderProgress() {
    console.log("Fetching progress for order ID:", searchingOrderId);
    if (searchingOrderId) {
      const { data, error } = await supabase
        .from("order.Workers")
        .select("progress_percent")
        .eq("order_id", searchingOrderId)
        .eq("worker_id", userProfile[0].id);

      if (error) {
        console.error("Error fetching order progress:", error);
      } else {
        setProgress(data[0]?.progress_percent || 0);
      }
    }
  }

  async function fetchOrdersId() {
    const { data, error } = await supabase
      .from("order.Workers")
      .select("order_id")
      .eq("worker_id", userProfile[0].id);

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrdersId(data);
    }
  }

  async function fetchOrdersDetails() {
    const allOrders = [];

    for (const orderId of ordersId) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId.order_id);

      if (error) {
        console.error("Error fetching order details:", error);
      } else {
        allOrders.push(...data);
      }
    }

    setOrders(allOrders);
  }
  useEffect(() => {
    fetchOrdersId();
  }, []);
  useEffect(() => {
    if (ordersId.length > 0) {
      fetchOrdersDetails();
    }
  }, [ordersId]);
  return (
    <div className="ordersPage">
      <button
        onClick={() => {
          SetActivePage(null);
        }}
        className="back"
      >
        Back
      </button>
      <div className="WorkerOrdersPageContent">
        <ul>
          {orders.length == 0 ? (
            <div>
              <h2>Loading orders...</h2>
            </div>
          ) : (
            orders?.map((order, index) => (
              <li
                onClick={() => {
                  setSelectedOrder(order);

                  setSearchingOrderId(order.id);
                }}
                key={index}
              >
                <h3>{order.NameOfTheOrder}</h3>
                <p>{order.Description}</p>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="ordersDescription">
        <h2>Order Description</h2>
        {selectedOrder == null ? (
          <p>Select an order to see more details.</p>
        ) : (
          <div>
            <DonutChart progress={progress} />
            <h3>{selectedOrder.NameOfTheOrder}</h3>
            <p>{selectedOrder.Description}</p>
            <p>Status: {selectedOrder.status}</p>
            <button onClick={() => setUpdateFieldStatus((prev) => !prev)}>
              Update progress
            </button>
            {updateFieldStatus ? (
              <div>
                <input
                  type="number"
                  placeholder="Enter progress %"
                  onChange={(e) => hadleProgressChange(e)}
                />
                <button
                  onClick={() => {
                    updateProgress();
                  }}
                >
                  Confirm
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkerOrdersPage;
