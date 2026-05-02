import React from "react";
import bagIcon from "../../Icons/workerBag.png";
import adminIcon from "../../Icons/protection.png";
import emailIcon from "../../Icons/message.png";
import passwordIcon from "../../Icons/padlock.png";

export default function AddWorkerInputs({ setName, setSecondName, setEmail, setPassword }) {

   function handleWorkerLoginChange(e) {
      setEmail(e.target.value);
    }
  
    function handleWorkerPasswordChange(e) {
      setPassword(e.target.value);
    }
  
    function handleNameChange(e) {
      setName(e.target.value);
    }
    function handleSecondNameChange(e) {
      setSecondName(e.target.value);
    }
 
  return (
   <>
  <div className="inputGroup">
            <label>Name</label>
            <div>
            <input
              onInput={(e) => handleNameChange(e)}
              type="text"
              placeholder="Enter name"
            />
          
            </div>
          </div>

          <div className="inputGroup">
            <label>Second name</label>
            <div>

            <input
              onInput={(e) => handleSecondNameChange(e)}
              type="text"
              placeholder="Enter second name"
            />
             
            </div>
          </div>

          <div className="inputGroup">
            <label>His login</label>
            <div>
            <input
              placeholder="Enter the email"
              onInput={(e) => handleWorkerLoginChange(e)}
              type="text"
            />
            <img src={emailIcon} alt="Worker" />
            </div>
          </div>
          <div className="inputGroup">
            <label>His password</label>
            <div>

            <input
              placeholder="Enter the password"
              onChange={(e) => handleWorkerPasswordChange(e)}
              type="text"
            />
                  <img src={passwordIcon} alt="Worker" />
            </div>
          </div>
   </>
  );
}
