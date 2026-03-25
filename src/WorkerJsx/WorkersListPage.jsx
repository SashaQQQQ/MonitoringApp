import { useState, useEffect, useContext } from "react";
import { DataContext } from "../CommonJsx/DataContext.js";
import "../Styles/WorkersListPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
import WorkerList from "./WorkerList.jsx";
import WorkerSearch from "./WorkerSearch.jsx";
function WorkersListPage({}) {
  const { whichRole, setActivePage } = useContext(DataContext);
  const [foundedWorkers, setFoundedWorkers] = useState([]);
  return (
    <div className="WorkersListPage">
      <h1 className="WorkersGreatingText">Workers List</h1>

      <WorkerSearch setFoundedWorkers={setFoundedWorkers} />
      {whichRole === "Owner" || whichRole === "Admin" ? (
        <button
          className="addWorkerBtn"
          onClick={() => {
            setActivePage("addWorker");
          }}
        >
          Add Worker
        </button>
      ) : null}

      <WorkerList foundedWorkers={foundedWorkers} />
    </div>
  );
}

export default WorkersListPage;
