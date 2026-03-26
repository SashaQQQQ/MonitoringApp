import { useState, useEffect, useContext } from "react";
import { DataContext } from "../CommonJsx/DataContext.js";
import "../Styles/WorkersListPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
import workerIcon from "../Icons/worker.png";

function WorkersList({ foundedWorkers }) {
  const [workers, setWorkers] = useState([]);
  const { whichRole, setActivePage, setOtherUser } = useContext(DataContext);
  const { userProfile } = useContext(DataContext);

  function renderWorker(worker) {
    if (userProfile?.[0]?.id === worker.id) return null;
    return (
      <li key={worker.id}>
        <div className="workerInfoGroup">
          <img className="workerImg" src={workerIcon} alt="" />
          <p>
            {worker.name} {worker.secondName}
          </p>
          <a href={`mailto:${worker.email}`}>{worker.email}</a>
        </div>

        <div>
          {whichRole == "Owner" || whichRole == "Admin" ? (
            <button
              className="deleteWorker"
              onClick={() => DeleteWorker(worker.id)}
            >
              Delete
            </button>
          ) : null}

          <button className="contactWorker" onClick={() => contact(worker)}>
            Contact
          </button>
        </div>
      </li>
    );
  }

  async function fetchWorkers() {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching workers:", error);
      return;
    }
    if (data) {
      setWorkers(data);
    }
  }

  function contact(user) {
    setOtherUser(user);
    setActivePage("chats");
  }

  async function DeleteWorker(workerId) {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", workerId);
    if (error) {
      console.error("Error deleting worker:", error);
      return;
    }

    fetchWorkers();
  }

  useEffect(() => {
    fetchWorkers();
  }, []);
  return (
    <div className="WorkersList">
      <ul>
        {foundedWorkers.length > 0 ? (
          foundedWorkers.map((worker) => renderWorker(worker))
        ) : workers.length > 0 ? (
          workers.map((worker) => renderWorker(worker))
        ) : (
          <p>No workers found</p>
        )}
      </ul>
    </div>
  );
}

export default WorkersList;
