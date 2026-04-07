import { useState, useEffect, use } from "react";

import "../Styles/AddWorker.css";
import { supabase } from "./SupabaseClient.js";
function AddWorker() {
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");

  const [role, setRole] = useState("");
  const [workerLogin, setWorkerLogin] = useState("");
  const [workerPassword, setWorkerPassword] = useState("");

  async function handleAddWorker() {
    if (!name || !secondName || !role || !workerLogin || !workerPassword) {
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: workerLogin,
      password: workerPassword,
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    const userId = authData.user.id;

    const { error: workerError } = await supabase.from("users").insert([
      {
        id: userId,
        name: name,
        secondName: secondName,
        Role: role,
        email: workerLogin,
      },
    ]);

    if (workerError) {
      alert(workerError.message);
      return;
    }

    setName("");
    setSecondName("");

    setRole("");
    setWorkerLogin("");
    setWorkerPassword("");
  }

  function handleWorkerLoginChange(e) {
    setWorkerLogin(e.target.value);
  }

  function handleWorkerPasswordChange(e) {
    setWorkerPassword(e.target.value);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleSecondNameChange(e) {
    setSecondName(e.target.value);
  }
  function handleRoleChange(e) {
    setRole(e.target.value);
  }

  return (
    <div className="AddWorker">
      <div className="formCard">
        <h1>Add new worker</h1>
        <p className="subtitle">Fill in the information below</p>

        <div className="workerForm">
          <div className="inputGroup">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e)}
              type="text"
              placeholder="Enter name"
            />
          </div>

          <div className="inputGroup">
            <label>Second name</label>
            <input
              value={secondName}
              onChange={(e) => handleSecondNameChange(e)}
              type="text"
              placeholder="Enter second name"
            />
          </div>

          <div className="inputGroup">
            <label>Role</label>
            <select
              onChange={(e) => {
                handleRoleChange(e);
              }}
            >
              <option value="" disabled defaultValue={"Admin"}>
                Select role
              </option>

              <option value="Admin">Admin</option>
              <option value="Worker">Worker</option>
            </select>
          </div>
          <div className="inputGroup">
            <label>His login</label>
            <input
              value={workerLogin}
              onChange={(e) => handleWorkerLoginChange(e)}
              type="text"
            />
          </div>
          <div className="inputGroup">
            <label>His password</label>
            <input
              workerPassword={workerPassword}
              onChange={(e) => handleWorkerPasswordChange(e)}
              type="text"
            />
          </div>
          <button onClick={handleAddWorker} className="submitBtn">
            Add worker
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddWorker;
