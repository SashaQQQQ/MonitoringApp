import { useState, useEffect } from "react";
import { useContext } from "react";
import { DataContext } from "../CommonJsx/DataContext.js";
import "../Styles/WorkersListPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
import workerIcon from "../Icons/worker.png";

function WorkersList({ foundedWorkers }) {
  const [workers, setWorkers] = useState([]);
  const { whichRole, setActivePage } = useContext(DataContext);
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
        {foundedWorkers.length != 0
          ? foundedWorkers.map((worker, index) => (
              <li key={index}>
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

                  <button
                    className="contactWorker"
                    onClick={() => addContact(worker.login)}
                  >
                    Contact
                  </button>
                </div>
              </li>
            ))
          : workers.map((worker, index) => (
              <li key={index}>
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
                  <button
                    className="contactWorker"
                    onClick={() => addContact(worker.login)}
                  >
                    Contact
                  </button>
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
}

export default WorkersList;
