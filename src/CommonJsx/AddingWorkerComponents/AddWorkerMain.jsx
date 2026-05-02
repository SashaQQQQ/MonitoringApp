import { useState, useEffect, useContext } from "react";
import bagIcon from "../../Icons/workerBag.png";
import adminIcon from "../../Icons/protection.png";
import emailIcon from "../../Icons/message.png";
import passwordIcon from "../../Icons/padlock.png";
import "../../Styles/AddWorker.css";
import { DataContext } from "../DataContext.jsx";
import { supabase } from "../SupabaseClient.js";

import AddWorkerInputs from "./AddWorkerInputs.jsx";

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
    setActivePage("workers");
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

        <AddWorkerInputs setName={setName} setSecondName={setSecondName} setWorkerEmail={setWorkerLogin} setPassword={setWorkerPassword}/>
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
