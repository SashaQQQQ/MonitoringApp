import { useState, useEffect } from "react";
import { supabase } from "./SupabaseClient.js";
import "../Styles/OrdersPage.css";

function AddOrderForm({ setAddOrderFormStatus }) {
  const [newOrderName, setNewOrderName] = useState("");
  const [newOrderDescription, setNewOrderDescription] = useState("");
  const [newOrderWorkers, setNewOrderWorkers] = useState([]);
  const [finalDate, setFinalDate] = useState(null);

  const [searchedWorkers, setSearchedWorkers] = useState(null);
  const [chosenWorkers, setChosenWorkers] = useState([]);

  function handleOrderNameChange(e) {
    setNewOrderName(e.target.value);
  }
  async function SaveOrder() {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          NameOfTheOrder: newOrderName,
          Description: newOrderDescription,
          AmountOfWorkers: newOrderWorkers.length + 1,
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
          },
        ]);
      if (workerError) {
        console.error("Error adding worker to order:", workerError);
      } else {
        console.log("Worker added to order successfully:", workerData);
      }
    }
  }

  function handleFinalDateChange(e) {
    setFinalDate(e.target.value);
    console.log(e.target.value);
  }

  function handleOrderDescriptionChange(e) {
    setNewOrderDescription(e.target.value);
  }
  function handleAddWorkerToOrder(worker) {
    setChosenWorkers((prevWorkers) => [...prevWorkers, worker]);
  }
  function handleRemoveWorkerFromOrder(worker) {
    setChosenWorkers((prevWorkers) =>
      prevWorkers.filter((Worker) => Worker.id !== worker.id),
    );
  }
  async function searchWorkersInDatabase(workerName) {
    if (workerName.length == 0) {
      setSearchedWorkers(null);
      return;
    }

    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .ilike("Name", `%${workerName}%`)
      .order("Name", { ascending: true });

    if (error) {
      console.error("Error searching workers:", error);
      return [];
    } else {
      setSearchedWorkers(data);
      console.log("Workers found:", data);
    }
  }
  return (
    <div className="addOrderForm">
      <button
        className="backBtn"
        onClick={() => {
          setAddOrderFormStatus(false);
        }}
      >
        Back
      </button>
      <h1>Order Form</h1>
      <input
        onChange={(e) => {
          handleOrderNameChange(e);
        }}
        type="text"
        placeholder="Order Name"
      />
      <textarea
        onChange={(e) => {
          handleOrderDescriptionChange(e);
        }}
        name=""
        id=""
        placeholder="Order Description"
      ></textarea>
      <input
        onClick={(e) => {
          handleFinalDateChange(e);
        }}
        type="date"
        name=""
        id=""
        placeholder="Final Date"
      />
      <div className="AddWorkersToOrder">
        <h3>Add workers to order:</h3>
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter the name of worker"
          onChange={(e) => {
            searchWorkersInDatabase(e.target.value);
          }}
        />
        <div>
          <ul>
            <h3>Workers in order:</h3>
            {chosenWorkers?.map((worker, index) => (
              <li key={index}>
                {worker.Name}{" "}
                <button
                  onClick={() => {
                    handleRemoveWorkerFromOrder(worker);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <ul>
            <h3>Searched workers:</h3>
            {searchedWorkers?.map((worker, index) => (
              <li key={index}>
                {worker.Name}{" "}
                <button
                  onClick={() => {
                    handleAddWorkerToOrder(worker);
                  }}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        onClick={() => {
          SaveOrder();
        }}
        className="SaveOrder"
      >
        Save order
      </button>
    </div>
  );
}

export default AddOrderForm;
