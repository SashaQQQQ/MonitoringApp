import { useState, useEffect, useContext } from "react";
import { supabase } from "../SupabaseClient.js";
import "../../Styles/SelectedOrderDescription.css";
import { DataContext } from "../DataContext.jsx";
import DonutChart from "../SpecialComponents/DonutChart.jsx";
import workerIcon from "../../Icons/worker.png";

function OverallOrdersDescription({
  setSelectedOrder,
  selectedOrder,
  fetchOrders,
}) {
  const [workers, setWorkers] = useState([]);
  const { whichRole } = useContext(DataContext);
  const [activeWorkerCommentId, setActiveWorkerCommentId] = useState(null);

  //___________EDITING_____________________________________
  const [editingStatus, setEditingStatus] = useState(false);
  const [newTitle, setNewTitle] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newDescription, setNewDescription] = useState(null);

  async function fetchWorkers() {
    if (!selectedOrder?.id) return;

    const { data, error } = await supabase
      .from("order.Workers")
      .select(
        "progress_percent,Role, comment, users(id,name,avatarUrl, secondName)",
      )
      .eq("order_id", selectedOrder?.id);

    const combinedData = data.map((user) => {
      return {
        ...user.users,
        progress_percent: user.progress_percent || 0,
        comment: user.comment,
        Role: user.Role,
      };
    });
    setWorkers(combinedData);
  }

  function handleEditingStatusSwitch() {
    setNewDate(selectedOrder?.FinalDate);
    setNewDescription(selectedOrder?.Description);
    setNewTitle(selectedOrder?.Title);

    setEditingStatus((prev) => {
      return !prev;
    });
  }

  function handleTitleChange(e) {
    setNewTitle(e.target.value);
  }
  function handleDateChange(e) {
    const date = new Date(e.target.value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    setNewDate(`${year}-${month}-${day}`);
  }
  function handleDescriptionChange(e) {
    setNewDescription(e.target.value);
  }

  async function saveChanges() {
    const updates = {
      Title: newTitle?.trim() || selectedOrder?.Title,
      FinalDate: newDate?.trim() || selectedOrder?.FinalDate,
      Description: newDescription?.trim() || selectedOrder?.Description,
    };
    console.log(updates.FinalDate);
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", selectedOrder?.id);

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
    }
    setEditingStatus(false);
    setNewDate("");
    setNewDescription("");
    setNewTitle("");
    fetchOrders();
  }

  async function deleteOrder() {
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", selectedOrder?.id);

    if (error) return;
    if (selectedOrder?.readyProcent >= 100) {
      console.log(workers);
      const ids = workers.map((worker) => worker.id);
      if (ids.length > 0) {
        await supabase.rpc("increment_finished_orders", { user_ids: ids });
        console.log("works");
      }
    }
    setSelectedOrder(null);
    fetchOrders();
  }

  useEffect(() => {
    setEditingStatus(false);
    setNewDate(null);
    setNewDescription(null);
    setNewTitle(null);
    setActiveWorkerCommentId(null);
    fetchWorkers();
  }, [selectedOrder]);

  return (
    <>
      {selectedOrder ? (
        <div className="orderDescription">
          <div className="managementButtons">
            {editingStatus ? (
              <button
                onClick={() => {
                  saveChanges();
                }}
                className="saveChangesBtn"
              >
                Save
              </button>
            ) : null}

            <button
              onClick={() => {
                handleEditingStatusSwitch();
              }}
              className="editBtn"
            >
              Edit
            </button>
            <button
              className="deleteBtn"
              onClick={() => {
                deleteOrder(selectedOrder?.id);
              }}
            >
              Delete order
            </button>
          </div>
          <div className="selectedOrderInfo">
            <p>
              Order:{" "}
              {editingStatus ? (
                <input
                  type="text"
                  onInput={(e) => {
                    handleTitleChange(e);
                  }}
                  value={newTitle}
                  placeholder={selectedOrder?.Title}
                />
              ) : (
                selectedOrder?.Title
              )}{" "}
            </p>

            <p>
              Due to:{" "}
              {editingStatus ? (
                <input
                  onInput={(e) => {
                    handleDateChange(e);
                  }}
                  value={newDate}
                  placeholder={selectedOrder?.FinalDate}
                  type="date"
                />
              ) : (
                selectedOrder?.FinalDate
              )}
            </p>
          </div>
          <div className="orderDates">
            <p>
              Time left: <br />
              {Math.ceil(
                (new Date(selectedOrder.FinalDate) - new Date()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              days
            </p>
            <p>
              Deadline: <br />
              {selectedOrder?.FinalDate || "N/A"}
            </p>
            <p>
              Today: <br /> {new Date().toISOString().split("T")[0]}
            </p>
          </div>
          <DonutChart progress={selectedOrder?.progress_percent} />

          <div className="selectedOrderDescription">
            <h2>Description</h2>
            <p>
              {editingStatus ? (
                <textarea
                  value={newDescription}
                  onInput={(e) => {
                    handleDescriptionChange(e);
                  }}
                  placeholder={selectedOrder?.Description}
                />
              ) : (
                selectedOrder?.Description
              )}
            </p>
          </div>
          <div className="selectedOrderWorkerss">
            <p className="workersAmount">
              Amount of workers: {selectedOrder.AmountOfWorkers}
            </p>

            <ul>
              {workers.length === 0 ? (
                <li>No workers found</li>
              ) : (
                workers?.map((worker) => (
                  <li
                    title="Click to see the comment"
                    key={worker.id}
                    onClick={() => {
                      setActiveWorkerCommentId(worker.id);
                    }}
                  >
                    <div className="orderWorkersDetails">
                      <img src={worker.avatarUrl || workerIcon} alt="" />
                      <p>
                        {worker.name} {worker.secondName} <br /> Role:{" "}
                        {worker.Role}
                      </p>
                      <h5>{worker.progress_percent}%</h5>
                    </div>

                    {activeWorkerCommentId === worker.id ? (
                      <div className="commentContainer">
                        <h3>{worker.name} says:</h3>
                        <p className="comment">{worker.comment}</p>
                      </div>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>No order selected</p>
      )}
    </>
  );
}

export default OverallOrdersDescription;
