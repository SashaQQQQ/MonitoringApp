import { useState, useEffect, useContext } from "react";
import bagIcon from "../Icons/workerBag.png";
import adminIcon from "../Icons/protection.png";
import { DataContext } from "./DataContext.jsx";

import "../Styles/AddWorker.css";
import { supabase } from "./SupabaseClient.js";
function AddWorker() {
  const { setActivePage } = useContext(DataContext);
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
    setRole(e);
  }
  useEffect(() => {
    console.log(role);
  }, [role]);
  return (
    <div className="AddWorker">
      <div className="formCard">
        <h1>Add new worker</h1>
        <p className="subtitle">
          Fill in the information of employee to add him to the system
        </p>

        <div className="workerForm">
          <div className="inputGroup">
            <label>Name</label>
            <div>
            <input
              value={name}
              onInput={(e) => handleNameChange(e)}
              type="text"
              placeholder="Enter name"
            />
            <img src="" alt="Worker" />
            </div>
          </div>

          <div className="inputGroup">
            <label>Second name</label>
            <div>

            <input
              value={secondName}
              onInput={(e) => handleSecondNameChange(e)}
              type="text"
              placeholder="Enter second name"
            />
                  <img src="" alt="Worker" />
            </div>
          </div>

          <div className="inputGroup">
            <label>His login</label>
            <div>
            <input
              placeholder="Enter the email"
              value={workerLogin}
              onInput={(e) => handleWorkerLoginChange(e)}
              type="text"
            />
      <img src="" alt="Worker" />
            </div>
          </div>
          <div className="inputGroup">
            <label>His password</label>
            <div>

            <input
              placeholder="Enter the password"
              workerPassword={workerPassword}
              onChange={(e) => handleWorkerPasswordChange(e)}
              type="text"
            />
                  <img src="" alt="Worker" />
            </div>
          </div>
          <div className="roleChoice">
            <label className="choiceContainer">
            

              <input
                name="role"
                type="radio"
                value="Worker"
                onInput={(e) => {
                  handleRoleChange(e.target.value);
                }}
              />
           
              <span className="customRadio"></span>
            <div className="iconContainer" >
              <img src={bagIcon} alt="Worker" />
              </div>
              <div>
                <h3>Worker</h3>
                <p>Access to completing orders</p>
              </div>
            </label>

            <label className="choiceContainer">
              <input
                name="role"
                type="radio"
                value="Admin"
                onInput={(e) => {
                  handleRoleChange(e.target.value);
                }}
              />
              <span className="customRadio"></span>
            <div className="iconContainer" >
              <img src={adminIcon} alt="Admin" />

            </div>
              <div>
                <h3>Admin</h3>
                <p>Full access to the management</p>
              </div>
            </label>
          </div>
          <div className="formBtns">
            <button
              onClick={() => {
                setActivePage("workers");
              }}
              className="formBackBtn"
            >
              Back
            </button>
            <button onClick={handleAddWorker} className="submitBtn">
              Add worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddWorker;
