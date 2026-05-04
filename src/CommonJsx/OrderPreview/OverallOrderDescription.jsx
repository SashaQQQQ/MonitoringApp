import { useState, useEffect, useContext } from "react";
import { supabase } from "../SupabaseClient.js";
import "../../Styles/SelectedOrderDescription.css";
import { DataContext } from "../DataContext.jsx";
import DonutChart from "../SpecialComponents/DonutChart.jsx";
import workerIcon from "../../Icons/worker.png";

function OverallOrdersDescription({
  setSelectedOrder,
  selectedOrder,
  fetchOrders,
}) {
  const [workers, setWorkers] = useState([]);
  const { whichRole } = useContext(DataContext);
  const [activeWorkerCommentId, setActiveWorkerCommentId] = useState(null);

  async function fetchWorkers() {
    if (!selectedOrder?.id) return;

    const { data, error } = await supabase
      .from("order.Workers")
      .select("progress_percent, comment, users(id,name, secondName)")
      .eq("order_id", selectedOrder?.id);

    const combinedData = data.map((user) => {
      return {
        ...user.users,
        progress_percent: user.progress_percent || 0,
        comment: user.comment,
      };
    });
    setWorkers(combinedData);
  }

  async function deleteOrder(orderId) {
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) return;
    if (selectedOrder?.readyProcent >= 100) {
      console.log(workers);
      const ids = workers.map((worker) => worker.id);
      if (ids.length > 0) {
        await supabase.rpc("increment_finished_orders", { user_ids: ids });
        console.log("works");
      }
    }
    setSelectedOrder(null);
    fetchOrders();
  }

  useEffect(() => {
    setActiveWorkerCommentId(null);
    fetchWorkers();
  }, [selectedOrder]);

  return (
    <>
      {selectedOrder ? (
        <div className="orderDescription">
          <div className="orderOverallInfo">
            <div className="selectedOrderInfo">
              <button
                onClick={() => {
                  deleteOrder(selectedOrder?.id);
                }}
              >
                Delete order
              </button>

              <p>Order: {selectedOrder?.Title}</p>

              <p>Due to: {selectedOrder?.FinalDate}</p>
            </div>
            <DonutChart progress={selectedOrder?.progress_percent} />
          </div>

          <div className="selectedOrderDescription">
            <h2>Description</h2>
            <p>{selectedOrder?.Description}</p>
          </div>
          <div className="selectedOrderWorkerss">
            <p className="workersAmount">
              Amount of workers: {selectedOrder.AmountOfWorkers}
            </p>

            <ul>
              {workers.length === 0 ? (
                <li>No workers found</li>
              ) : (
                workers?.map((worker) => (
                  <li
                    title="Click to see the comment"
                    key={worker.id}
                    onClick={() => {
                      setActiveWorkerCommentId(worker.id);
                    }}
                  >
                    <div className="orderWorkersDetails">
                      <p>
                        {worker.name} {worker.secondName}
                      </p>
                      <h5>{worker.progress_percent}%</h5>
                    </div>

                    {activeWorkerCommentId === worker.id ? (
                      <div className="commentContainer">
                        <h3>{worker.name} says:</h3>
                        <p className="comment">{worker.comment}</p>
                      </div>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>No order selected</p>
      )}
    </>
  );
}

export default OverallOrdersDescription;
