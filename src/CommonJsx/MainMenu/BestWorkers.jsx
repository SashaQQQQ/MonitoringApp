import { useEffect, useState } from "react";
import workerIcon from "../../Icons/worker.png";
import "../../Styles/MainMenuCss/BestWorkers.css";
import { supabase } from "../SupabaseClient.js";

function BestWorkers() {
  const [bestWorkers, setBestWorkers] = useState([]);

  async function fetchBestWorkers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("finishedOrders", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching best workers:", error);
    } else {
      const ids = data.map((worker) => worker.id);

      const { data: finalData, error: finalError } = await supabase
        .from("order.Workers")
        .select("order_id, worker_id")
        .in("worker_id", ids);

      const orderCount = {};

      finalData.forEach((o) => {
        orderCount[o.worker_id] = orderCount[o.worker_id] + 1 || 0;
      });

      const combined = data.map((worker) => {
        return {
          ...worker,
          orderCount: orderCount[worker.id] || 0,
        };
      });

      setBestWorkers(combined);
    }
  }

  useEffect(() => {
    fetchBestWorkers();
  }, []);
  return (
    <div className="BestWorkers">
      {bestWorkers.length > 0 ? (
        bestWorkers.map((worker) => (
          <div key={worker.id} className="workerCard">
            <div className="workerInfo">
              <img src={workerIcon} alt={worker.name} />
              <p>
                {worker.name} {worker.secondName}
              </p>
            </div>
            <div className="workerStats">
              <p className="amountOfOrders">Active {worker.orderCount + " "}</p>
              <p className="performance">Perf: {worker.finishedOrders}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No workers found</p>
      )}
    </div>
  );
}

export default BestWorkers;
