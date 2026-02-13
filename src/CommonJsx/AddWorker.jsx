import { useState, useEffect, use } from "react";

import "../Styles/AddWorker.css";
import { supabase } from "./SupabaseClient.js";
function AddWorker() {
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");
  const [workerLogin, setWorkerLogin] = useState("");
  const [workerPassword, setWorkerPassword] = useState("");

  async function handleAddWorker() {
    if (
      !name ||
      !secondName ||
      !dateOfBirth ||
      !role ||
      !workerLogin ||
      !workerPassword
    ) {
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

    const { error: workerError } = await supabase.from("workers").insert([
      {
        id: userId,
        Name: name,
        SecondName: secondName,
        DateOfBirth: dateOfBirth,
        Role: role,
      },
    ]);

    if (workerError) {
      alert(workerError.message);
      return;
    }

    const { error: profileError } = await supabase.from("users").insert([
      {
        id: userId,
        login: workerLogin,
        name: name,
        secondName: secondName,
        Role: role,
      },
    ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Worker created successfully!");

    setName("");
    setSecondName("");
    setDateOfBirth("");
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
  function handleDateOfBirthChange(e) {
    setDateOfBirth(e.target.value);
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
              onChange={(e) => handleNameChange(e)}
              type="text"
              placeholder="Enter name"
            />
          </div>

          <div className="inputGroup">
            <label>Second name</label>
            <input
              onChange={(e) => handleSecondNameChange(e)}
              type="text"
              placeholder="Enter second name"
            />
          </div>

          <div className="inputGroup">
            <label>Date of birth</label>
            <input onChange={(e) => handleDateOfBirthChange(e)} type="date" />
          </div>

          <div className="inputGroup">
            <label>Role</label>
            <select
              name=""
              id=""
              onChange={(e) => {
                handleRoleChange(e);
              }}
            >
              <option value="" disabled selected>
                Select role
              </option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Worker">Worker</option>
            </select>
          </div>
          <div className="inputGroup">
            <label>His login</label>
            <input onChange={(e) => handleWorkerLoginChange(e)} type="text" />
          </div>
          <div className="inputGroup">
            <label>His password</label>
            <input
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
