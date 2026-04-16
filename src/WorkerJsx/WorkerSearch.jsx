import { useState, useEffect } from "react";
import "../Styles/WorkersListPage.css";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import { useContext } from "react";
import { supabase } from "../CommonJsx/SupabaseClient.js";

function WorkerSearch({ setFoundedWorkers }) {
  const [currentRequest, setCurrentRequest] = useState("");
  const { userProfile, setActivePage } = useContext(DataContext);
  function handleRequestChange(e) {
    setCurrentRequest(e.target.value);
  }

  async function fetchWorkers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("name", `%${currentRequest}%`);

    if (error) {
      console.log("error while searching");
    } else {
      setFoundedWorkers(data);
    }
  }
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (currentRequest.length > 0) {
        fetchWorkers();
      } else {
        setFoundedWorkers([]);
      }
    }, 300);
    return () => clearTimeout(timeOut);
  }, [currentRequest]);
  return (

      <div className="searchContainer">

      <input
        onChange={(e) => {
          handleRequestChange(e);
        }}
        className="WorkerSearch"
        type="text"
        placeholder="Search workers..."
      />

        {userProfile.Role === "Owner" || userProfile.Role === "Admin" ? (
        <button
          className="addWorkerBtn"
          onClick={() => {
            setActivePage("addWorker");
          }}
        >
          Add Worker
        </button>
      ) : null}
      </div>
  
  );
}

export default WorkerSearch;
