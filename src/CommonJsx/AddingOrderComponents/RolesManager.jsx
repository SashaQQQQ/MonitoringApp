import { useState, useEffect } from "react";

import "../../Styles/AddOrdersForm.css";

function OverallNewOrderInfo({
  chosenWorkers,
  setChosenWorkers,
  workerRoles,
  setWorkerRoles,
}) {
  function handleRemoveWorkerFromOrder(worker) {
    setChosenWorkers((prevWorkers) =>
      prevWorkers.filter((Worker) => Worker.id !== worker.id),
    );
    setWorkerRoles((prevRoles) => {
      const updatedRoles = { ...prevRoles };
      delete updatedRoles[worker.id];
      return updatedRoles;
    });
  }

  function saveWorkerRole(workerId, role) {
    setChosenWorkers((prevWorkers) =>
      prevWorkers.map((worker) =>
        worker.id === workerId ? { ...worker, role: role } : worker,
      ),
    );
  }

  return (
    <div className="workerRoleGroup">
      <div className="labelGroup">
        <h3>Give a role to each worker</h3>
      </div>
      <ul>
        {chosenWorkers.length > 0
          ? chosenWorkers.map((worker) => (
              <li key={worker.id}>
                <p>{worker.name} {worker.secondName}</p>
                <div>

                <input
                  type="text"
                  disabled={!!worker.role}
                  placeholder="Role.."
                  onChange={(e) => {
                    setWorkerRoles((prevRoles) => ({
                      ...prevRoles,
                      [worker.id]: e.target.value,
                    }));
                  }}
                />
                {!worker.role && (
                  <button
                    onClick={() =>
                      saveWorkerRole(worker.id, workerRoles[worker.id])
                    }
                  >
                  Save Role
                </button>) }
                <button onClick={() => handleRemoveWorkerFromOrder(worker)}>
                  Delete worker
                </button>
                </div>
              </li>
            ))
          : <li>No workers added</li>}
      </ul>
    </div>
  );
}

export default OverallNewOrderInfo;
