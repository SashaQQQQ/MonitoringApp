import { useState, useEffect, useContext } from "react";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import homeIcon from "../Icons/home.png";
import chatIcon from "../Icons/chat.png";
import workerIcon from "../Icons/worker.png";
import addWorkerIcon from "../Icons/addWorker.png";
import ordersIcon from "../Icons/order.png";
import logOutIcon from "../Icons/exit.png";
import "../Styles/Navigation.css";
import { Link } from "react-router-dom";

function NavigationBar() {
  const { setActivePage } = useContext(DataContext);
  return (
    <div className="navigationMenu">
      <div onClick={() => setActivePage("main")}>
        <img src={homeIcon} alt="Home" />
        <p>Main Page</p>
      </div>
      <div
        onClick={() => {
          setActivePage("workers");
          console.log("Workers");
        }}
      >
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

      <Link className="logOutBtn" to="/">
        <div onClick={() => setActivePage("main")}>
          <img src={logOutIcon} alt="Log Out" />
          <p>Log Out</p>
        </div>
      </Link>
    </div>
  );
}

export default NavigationBar;
