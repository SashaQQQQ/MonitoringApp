import { useState, useEffect, useContext } from "react";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import "../Styles/WorkersListPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
import workerIcon from "../Icons/worker.png";

function WorkersList({ foundedWorkers }) {
  const [workers, setWorkers] = useState([]);
  const { userProfile, setActivePage, setOtherUser } = useContext(DataContext);

  function renderItemList(worker) {
    if (userProfile?.id === worker.id) return null;
    return (
      <li key={worker.id}>
        <div className="workerInfoGroup">
          <img className="workerImg" src={worker.avatarUrl || workerIcon} alt="" />
          <div className="personalData">

          <p className="workerName">
            {worker.name} {worker.secondName}
          </p>
          <a className="workerEmail" href={`mailto:${worker.email}`}>
            {worker.email}
          </a>
          <p className="workerRole">{worker?.Role}</p>
          </div>
        </div>
        <div>
          <div className="buttons">
            {userProfile.Role == "Owner" || userProfile.Role == "Admin" ? (
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
    console.log(workerId);
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", workerId)
  
    
      
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
          foundedWorkers.map((worker) => renderItemList(worker))
        ) : workers.length > 0 ? (
          workers.map((worker) => renderItemList(worker))
        ) : (
          <p>No workers found</p>
        )}
      </ul>
    </div>
  );
}

export default WorkersList;
