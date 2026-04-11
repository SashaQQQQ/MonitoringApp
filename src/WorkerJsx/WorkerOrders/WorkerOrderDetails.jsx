import { supabase } from "../../CommonJsx/SupabaseClient.js";
import { DataContext } from "../../CommonJsx/DataContext.jsx";
import DonutChart from "../../CommonJsx/DonutChart.jsx";
import { useState, useEffect, useContext } from "react";

const WorkerOrderDetails = ({
  setActivePanel,
  selectedOrder,
  setSelectedOrder,
}) => {
  const { userProfile } = useContext(DataContext);
  const [updatedProgress, setUpdatedProgress] = useState(0);
  const [comment, setComment] = useState("");

  function handleProgressUpdate(e) {
    const number = Number(e);
    if (number < 0 || number > 100) {
      setUpdatedProgress(0);
    } else {
      setUpdatedProgress(number);
    }
  }
  function handleCommentChange(e) {
    setComment(e);
  }

  async function updateChanges() {
    if (!selectedOrder?.id) return;
    if (comment.trim() === "" && updatedProgress === 0) return;
    const { data, error } = await supabase
      .from("order.Workers")
      .update({ progress_percent: updatedProgress, comment: comment })
      .eq("order_id", selectedOrder?.id)
      .eq("worker_id", userProfile?.id);

    if (error) {
      console.error("Error updating progress:", error);
    } else {
      console.log("Progress updated successfully:", data);
    }
  }
  useEffect(() => {
    setUpdatedProgress(selectedOrder.myProgress);
  }, [selectedOrder]);

  return (
    <>
      <h1 className="ordersGreatingText">Order details</h1>
      <button
        className="backBtn"
        onClick={() => {
          setActivePanel("list");
        }}
      >
        ←
      </button>
      {selectedOrder?.id ? (
        <div className="workerOrderDetails">
          <h3>
            Title:{" "}
            {selectedOrder?.Title && selectedOrder?.Title.length > 20
              ? selectedOrder?.Title.slice(0, 20)
              : selectedOrder?.Title}
          </h3>
          <h4>My role: {selectedOrder?.myRole || "Not known"}</h4>
          <div className="description">
            <p>Description: {selectedOrder?.Description || "Not available"}</p>
          </div>

          <div className="orderDates">
            <p>
              Time left:
              {selectedOrder?.timeLeft > 0 ? selectedOrder.timeLeft : 0} days
            </p>
            <p>Deadline: {selectedOrder?.FinalDate || "N/A"}</p>
            <p>Today: {new Date().toISOString().split("T")[0]}</p>
          </div>

          <div className="progresses">
            <div className="labels">
              <p>My progress</p>
              <p>Overall progress</p>
            </div>
            <div className="charts">
              <DonutChart progress={selectedOrder?.myProgress || 0} />
              <DonutChart progress={selectedOrder?.averageProgress || 0} />
            </div>
          </div>

          <div className="form">
            <div className="inputFields">
              <p>Update your progress (%)</p>
              <input
                onInput={(e) => {
                  handleProgressUpdate(e.target.value);
                }}
                type="number"
                min="0"
                max="100"
                value={updatedProgress}
              />

              <p>Leave a comment</p>
              <input
                type="text"
                value={comment}
                onInput={(e) => {
                  handleCommentChange(e.target.value);
                }}
              />
            </div>

            <button onClick={updateChanges}>Save</button>
          </div>
        </div>
      ) : (
        <h4>Select an order to see details</h4>
      )}
    </>
  );
};

export default WorkerOrderDetails;
