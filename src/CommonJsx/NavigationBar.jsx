import { useState, useEffect, use } from "react";

import "../Styles/MainPage.css";

function NavigationBar({ role, setActivePage }) {
  return (
    <div className="navigationMenu">
      <div onClick={() => setActivePage("workers")}>
        <p>Workers</p>
      </div>
      {role === "Owner" || role === "Admin" ? (
        <div onClick={() => setActivePage("addWorker")}>
          <p>Add Worker</p>
        </div>
      ) : null}

      <div onClick={() => setActivePage("orders")}>
        <p>Orders</p>
      </div>

      <div onClick={() => setActivePage("chats")}>
        <p>Chats</p>
      </div>
    </div>
  );
}

export default NavigationBar;
