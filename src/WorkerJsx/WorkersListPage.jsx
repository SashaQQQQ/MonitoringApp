import { useState, useEffect, useContext } from "react";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import "../Styles/WorkersListPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
import WorkerList from "./WorkerList.jsx";
import WorkerSearch from "./WorkerSearch.jsx";
function WorkersListPage({}) {

  const [foundedWorkers, setFoundedWorkers] = useState([]);
  return (
    <div className="WorkersListPage">
      <h1 className="WorkersGreatingText">Workers</h1>

      <WorkerSearch setFoundedWorkers={setFoundedWorkers} />
    

      <WorkerList foundedWorkers={foundedWorkers} />
    </div>
  );
}

export default WorkersListPage;
