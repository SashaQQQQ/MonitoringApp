import { useState, useEffect, useContext } from "react";
import { DataContext } from "./DataContext.jsx";
import { supabase } from "./SupabaseClient.js";
import "../Styles/AddOrdersForm.css";
import hintIcon from "../Icons/question.png";
import userIcon from "../Icons/worker.png";
import OrderCalendar from "./AddingOrderComponents/OrderCalendar.jsx";
import OverallNewOrderInfo from "./AddingOrderComponents/OverallNewOrderInfo.jsx";
import WorkersSearch from "./AddingOrderComponents/WorkersSearch.jsx";
import RolesManager from "./AddingOrderComponents/RolesManager.jsx";
import backIcon from "../Icons/backArrow.png";

function AddOrderForm({ setAddOrderFormStatus }) {
  const [newOrderName, setNewOrderName] = useState("");
  const [newOrderDescription, setNewOrderDescription] = useState("");
  const [newOrderWorkers, setNewOrderWorkers] = useState([]);
  const [finalDate, setFinalDate] = useState(null);
  const [chosenWorkers, setChosenWorkers] = useState([]);
  const [workerRoles, setWorkerRoles] = useState({});
  const { setActivePage } = useContext(DataContext);

  async function SaveOrder() {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          Title: newOrderName,
          Description: newOrderDescription,
          AmountOfWorkers: chosenWorkers.length,
          FinalDate: finalDate,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error saving order:", error);
    } else {
      console.log("Order saved successfully:", data);
    }
    const orderId = data.id;

    for (const worker of chosenWorkers) {
      const { data: workerData, error: workerError } = await supabase
        .from("order.Workers")
        .insert([
          {
            order_id: orderId,
            worker_id: worker.id,
            Role: workerRoles[worker.id] || "",
          },
        ]);
      if (workerError) {
        console.error("Error adding worker to order:", workerError);
      } else {
        console.log("Worker added to order successfully:", workerData);
      }
    }
    setAddOrderFormStatus(false);
    console.log("Final date:", finalDate);
  }

  return (
    <div className="addOrderForm">
      <div className="inputColumn">
        <OverallNewOrderInfo
          newOrderName={newOrderName}
          setNewOrderName={setNewOrderName}
          newOrderDescription={newOrderDescription}
          setNewOrderDescription={setNewOrderDescription}
        />
        <WorkersSearch
          chosenWorkers={chosenWorkers}
          getSearchedWorkers={setChosenWorkers}
        />
        <div className="tutorial">
          <div className="adviseImg">
            <img src={hintIcon} alt="imgsss" />
          </div>
          <div className="tutorialText">
            <h2>How does it work?</h2>
            <p>
              To add a worker to the order, just click the "Add Worker" button
              near their name. To remove a worker from the order, click the
              "Remove Worker" button in the chosen workers list.
            </p>
          </div>
        </div>
      </div>
      <div className="inputColumn">
        <RolesManager
          setChosenWorkers={setChosenWorkers}
          chosenWorkers={chosenWorkers}
          setWorkerRoles={setWorkerRoles}
          workerRoles={workerRoles}
        />
        <div className="finalDateGroup">
          <OrderCalendar getFinalDate={setFinalDate} />
        </div>
      </div>
      <button
        className="saveBtn"
        onClick={() => {
          SaveOrder();
        }}
      >
        Save Order
      </button>
      <img
        className="backBtn"
        onClick={() => {
          setAddOrderFormStatus(false);
        }}
        src={backIcon}
        alt="Back"
      />
    </div>
  );
}

export default AddOrderForm;
