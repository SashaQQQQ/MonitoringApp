import { useState, useEffect, use } from "react";

import "../Styles/WorkersListPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
function WorkersListPage({ userProfile }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerProfile, setSelectedWorkerProfile] = useState(null);

  async function addContact(personLogin) {
    const { data, error } = await supabase
      .from("messages")
      .insert([{ sender: userProfile[0].login, receiver: personLogin }]);
  }
  async function fetchWorkers() {
    const { data, error } = await supabase.from("workers").select("*");

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
      .from("workers")
      .delete()
      .eq("id", workerId);
    if (error) {
      console.error("Error deleting worker:", error);
      return;
    }

    fetchWorkers();
  }
  async function loadProfile(workerId) {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("id", workerId)
      .single();

    if (error) {
      console.error("Error loading worker profile:", error);
      return;
    }
    if (data) {
      setSelectedWorkerProfile(data);
      console.log("Worker profile loaded:", data);
    }
  }
  useEffect(() => {
    fetchWorkers();
  }, []);
  return (
    <div className="WorkersListPage">
      <div className="actualList">
        <h1>Workers List</h1>
        <ul>
          {workers.map((worker, index) => (
            <li key={index} onMouseEnter={() => loadProfile(worker.id)}>
              <p>
                {worker.Name} {worker.SecondName}
              </p>
              <div>
                <button onClick={() => DeleteWorker(worker.id)}>Delete</button>
                <button onClick={() => addContact(worker.login)}>
                  Contact
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="selectedProfilePart">
        <h1>Selected worker</h1>
        <h4>
          {selectedWorkerProfile
            ? `${selectedWorkerProfile.Name} ${selectedWorkerProfile.SecondName}`
            : "No worker selected"}
        </h4>
        <h4>{selectedWorkerProfile ? selectedWorkerProfile.Role : "N/A"} </h4>
        <h4>
          Date of birth:{" "}
          {selectedWorkerProfile ? selectedWorkerProfile.Age : "N/A"}
        </h4>
      </div>
    </div>
  );
}

export default WorkersListPage;
