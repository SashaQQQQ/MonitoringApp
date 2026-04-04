import { useState, useEffect, useContext } from "react";
import "../Styles/WorkerOrderPage.css";

import { supabase } from "../CommonJsx/SupabaseClient.js";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import DonutChart from "../CommonJsx/DonutChart.jsx";

function WorkerOrdersPage({}) {
  const { userProfile, SetActivePage } = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [updatedProgress, setUpdatedProgress] = useState(0);
  const [comment, setComment] = useState("");

  function handleProgressUpdate(e) {
    if (e < 0 || e > 100) {
      setUpdatedProgress(0);
    } else {
      setUpdatedProgress(e);
    }
  }
  function handleCommentChange(e) {
    setComment(e);
  }

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

  async function updateChanges() {
    if (!selectedOrder.id) return;
    if (comment.trim() === "" && updatedProgress === 0) return;
    const { data, error } = await supabase
      .from("order.Workers")
      .update({ progress_percent: updatedProgress, comment: comment })
      .eq("order_id", selectedOrder.id)
      .eq("worker_id", userProfile.id);

    if (error) {
      console.error("Error updating progress:", error);
    } else {
      console.log("Progress updated successfully:", data);
      fetchOrders();
    }
  }
  useEffect(() => {
    setUpdatedProgress(selectedOrder.myProgress);
  }, [selectedOrder]);
  useEffect(() => {
    if (!selectedOrder.id) {
      return;
    }
    const refreshedSelectedOrder = orders.find(
      (order) => order.id === selectedOrder.id,
    );
    setSelectedOrder(refreshedSelectedOrder);
  }, [orders]);
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
      <div className="orderColumn">
        <h1 className="ordersGreatingText">Your Orders</h1>
        {orders.length > 0 ? <h4>Click to see the details</h4> : null}
        <ul>
          {orders.length > 0 ? (
            orders.map((order) => {
              return (
                <li
                  onClick={() => {
                    setSelectedOrder(order);
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
      </div>
      <div className="orderColumn">
        <h1 className="ordersGreatingText">Order details</h1>
        {selectedOrder.id ? (
          <div className="workerOrderDetails">
            <h3>Title: {selectedOrder?.Title || "N/A"}</h3>
            <h4>My role: {selectedOrder?.myRole || "Not known"}</h4>
            <div className="description">
              <p>
                Description: {selectedOrder?.Description || "Not available"}
              </p>
            </div>

            <div className="orderDates">
              <p>
                Time left:
                {selectedOrder?.timeLeft > 0 ? selectedOrder.timeLeft : 0} days
              </p>
              <p>Deadline: {selectedOrder?.FinalDate || "N/A"}</p>
              <p>Today: {new Date().toISOString().split("T")[0]}</p>
            </div>

            <div className="progresses">
              <div className="labels">
                <p>My progress</p>
                <p>Overall progress</p>
              </div>
              <div className="charts">
                <DonutChart progress={selectedOrder?.myProgress || 0} />
                <DonutChart progress={selectedOrder?.averageProgress || 0} />
              </div>
            </div>

            <div className="form">
              <div className="inputFields">
                <p>Update your progress (%)</p>
                <input
                  onInput={(e) => {
                    handleProgressUpdate(e.target.value);
                  }}
                  type="number"
                  min="0"
                  max="100"
                  value={updatedProgress}
                />

                <p>Leave a comment</p>
                <input
                  type="text"
                  value={comment}
                  onInput={(e) => {
                    handleCommentChange(e.target.value);
                  }}
                />
              </div>
              <div className="saveDetails">
                <button onClick={updateChanges}>Save the changes</button>
              </div>
            </div>
          </div>
        ) : (
          <h4>Select an order to see details</h4>
        )}
      </div>
    </div>
  );
}

export default WorkerOrdersPage;
