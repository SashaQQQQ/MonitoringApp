import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient.js";
import userIcon from "../../Icons/worker.png";
import "../../Styles/AddOrdersForm.css";

function OverallNewOrderInfo({ getSearchedWorkers, chosenWorkers }) {
  const [searchedWorkers, setSearchedWorkers] = useState([]);
  const [workersSearchRequest, setWorkersSearchRequest] = useState("");
  function handleWorkersSearchRequestChange(e) {
    setWorkersSearchRequest(e.target.value);
  }

  function addWorkerToOrder(worker) {
    getSearchedWorkers((prevWorkers) => [
      ...prevWorkers,
      { name: worker.name, id: worker.id, secondName: worker.secondName },
    ]);
  }
  async function searchWorkersInDatabase(workerName) {
    if (workerName.length == 0) {
      setSearchedWorkers(null);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("name", `%${workerName}%`)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error searching workers:", error);
      return [];
    } else {
      setSearchedWorkers(data);
      console.log("Workers found:", data);
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      if (workersSearchRequest.length == 0) {
        setSearchedWorkers([]);
        return;
      }
      searchWorkersInDatabase(workersSearchRequest);
    }, 300);
    return () => clearTimeout(delay);
  }, [workersSearchRequest]);

  return (
    <div className="workersGroup">
      <div className="labelGroup">
        <h3>Choose the workers</h3>
      </div>
      <input
        value={workersSearchRequest}
        type="text"
        placeholder="Search the workers..."
        onInput={(e) => {
          handleWorkersSearchRequestChange(e);
        }}
      />
      <ul className="listOfSearchedWorkers">
        {searchedWorkers.length > 0
          ? searchedWorkers.map((worker) => {
              if (chosenWorkers.some((w) => w.id === worker.id)) {
                return null;
              }
              return (
                <li key={worker.id}>
                  <div>
                    <img src={worker.avatarUrl || userIcon} alt="" />
                    <p>
                      {worker.name} {worker.lastName}
                    </p>
                  </div>
                  <button onClick={() => addWorkerToOrder(worker)}>
                    Add
                  </button>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}

export default OverallNewOrderInfo;
