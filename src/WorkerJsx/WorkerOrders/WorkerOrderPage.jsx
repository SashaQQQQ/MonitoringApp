import { useState, useEffect, useContext } from "react";
import "../../Styles/WorkerOrderPage.css";

import WorkerOrdersList from "./WorkerOrdersList.jsx";
import WorkerOrderDetails from "./WorkerOrderDetails.jsx";

function WorkerOrdersPage({}) {
  const [selectedOrder, setSelectedOrder] = useState({});
  const [activePanel, setActivePanel] = useState("list");
  return (
    <div className="workerOrdersPage">
      <div
        className={`orderColumn ${activePanel === "details" ? "hidden" : ""}`}
      >
        <WorkerOrdersList
          setActivePanel={setActivePanel}
          setSelectedOrder={setSelectedOrder}
        />
      </div>
      <div className={`orderColumn ${activePanel === "list" ? "hidden" : ""}`}>
        <WorkerOrderDetails
          setActivePanel={setActivePanel}
          selectedOrder={selectedOrder}
        />
      </div>
    </div>
  );
}

export default WorkerOrdersPage;
