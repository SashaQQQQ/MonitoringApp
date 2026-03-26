import { useState, useEffect, useContext } from "react";
import { supabase } from "./SupabaseClient";
import "../Styles/OrdersPage.css";
import { DataContext } from "./DataContext";
import DonutChart from "./DonutChart";
import workerIcon from "../Icons/worker.png";

function OverallOrdersDescription({ selectedOrder }) {
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

  useEffect(() => {
    console.log(workers);
  }, [workers]);
  useEffect(() => {
    fetchWorkers();
  }, [selectedOrder]);
  return (
    <>
      {selectedOrder ? (
        <div className="orderDescription">
          <div className="orderOverallInfo">
            <div className="selectedOrderInfo">
              <p>Order: {selectedOrder?.Title}</p>

              <p>Due to: {selectedOrder?.FinalDate}</p>
            </div>
            <DonutChart progress={selectedOrder?.ReadyProcent} />
          </div>

          <div className="selectedOrderDescription">
            <h2>Description</h2>
            <p>{selectedOrder?.Description}</p>
          </div>
          <div className="selectedOrderWorkers">
            <p className="workersAmount">
              Amount of workers on it: {selectedOrder.AmountOfWorkers}
            </p>

            <ul>
              {workers.length === 0 ? <p>No workers found</p> : null}
              {workers?.map((worker, index) => (
                <li key={worker?.id}>
                  <div className="orderWorkersDetails">
                    <img src={workerIcon} alt="" />
                    <p>
                      {worker?.name} {worker?.secondName}
                    </p>
                    <h5>{worker?.progress_percent}% done</h5>
                  </div>
                  {whichRole === "Owner" || whichRole === "Admin" ? (
                    <button>Delete</button>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default OverallOrdersDescription;
