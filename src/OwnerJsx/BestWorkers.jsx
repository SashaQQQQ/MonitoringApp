import { useState } from "react";

import "../Styles/BestWorkers.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";

function BestWorkers() {
  const [bestWorkers, setBestWorkers] = useState([
    { id: 1, name: "John", secondName: "Doe", performance: 95 },
    { id: 2, name: "Jane", secondName: "Smith", performance: 90 },
    { id: 3, name: "Bob", secondName: "Johnson", performance: 85 },
  ]);

  async function fetchBestWorkers() {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("performance", { ascending: false })
      .limit(5);
    if (error) {
      console.error("Error fetching best workers:", error);
    } else {
      setBestWorkers(data);
    }
  }
  return (
    <div className="BestWorkers">
      {bestWorkers.length > 0 ? (
        bestWorkers.map((worker) => (
          <div key={worker.id} className="workerCard">
            <div className="workerInfo">
              <p>
                {worker.name} {worker.secondName}
              </p>
            </div>

            <p className="performance">Performance: {worker.performance}</p>
          </div>
        ))
      ) : (
        <p>No workers found</p>
      )}
    </div>
  );
}

export default BestWorkers;
