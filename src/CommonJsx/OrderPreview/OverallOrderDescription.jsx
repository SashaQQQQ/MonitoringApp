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
  async function fetchWorkers() {
    if (!selectedOrder?.id) return;

    const { data, error } = await supabase
      .from("order.Workers")
      .select("worker_id, progress_percent")
      .eq("order_id", selectedOrder?.id);

    if (error) {
      console.log("error while fetching workers of the order");
    } else {
      const ids = data.map((worker) => worker.worker_id);
      if (ids.length === 0) {
        setWorkers([]);
        return;
      }
      const { data: dataWorker, error: errorWorker } = await supabase
        .from("users")
        .select("*")
        .in("id", ids);

      if (errorWorker) {
        console.log("error while getting names of workers");
      } else {
        const combinedData = dataWorker.map((user) => {
          const workerData = data.find((w) => {
            return w.worker_id === user.id;
          });
          return {
            ...user,
            progress_percent: workerData?.progress_percent || 0,
          };
        });

        setWorkers(combinedData);
      }
    }
  }

  async function deleteOrder(orderId) {
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
    } else {
      const { data: finalStepData, error: finalStepError } = await supabase
        .from("order.Workers")
        .delete()
        .eq("order_id", orderId)
        .select("worker_id");
      if (finalStepError) {
        console.error("Error deleting order workers:", finalStepError);
      } else {
        if (selectedOrder?.readyProcent === 100) {
          const ids = finalStepData.map((worker) => worker.worker_id);
          if (ids.length > 0) {
            await supabase.rpc("increment_finished_orders", { user_ids: ids });
          }
        }
      }
      setSelectedOrder(null);
      fetchOrders();
    }
  }

  useEffect(() => {
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
                  <li key={worker?.id}>
                    <div className="orderWorkersDetails">
                      <p>{worker?.secondName}</p>
                      <h5>{worker?.progress_percent}%</h5>
                    </div>
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
