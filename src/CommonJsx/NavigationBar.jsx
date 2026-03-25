import { useState, useEffect, use } from "react";
import homeIcon from "../Icons/home.png";
import chatIcon from "../Icons/chat.png";
import workerIcon from "../Icons/worker.png";
import addWorkerIcon from "../Icons/addWorker.png";
import ordersIcon from "../Icons/order.png";
import "../Styles/MainPage.css";

function NavigationBar({ role, setActivePage }) {
  return (
    <div className="navigationMenu">
      <div onClick={() => setActivePage("main")}>
        <img src={homeIcon} alt="Home" />
        <p>Main Page</p>
      </div>
      <div onClick={() => setActivePage("workers")}>
        <img src={workerIcon} alt="Workers" />
        <p>Workers</p>
      </div>

      <div onClick={() => setActivePage("orders")}>
        <img src={ordersIcon} alt="Orders" />
        <p>Orders</p>
      </div>

      <div onClick={() => setActivePage("chats")}>
        <img src={chatIcon} alt="Chats" />
        <p>Chats</p>
      </div>
    </div>
  );
}

export default NavigationBar;
