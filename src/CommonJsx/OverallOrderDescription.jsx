import { useState, useEffect } from "react";

import "../Styles/OrdersPage.css";

function OverallOrdersDescription({ selectedOrder }) {
  return (
    <div className="ordersDescription">
      <h2>Order Description</h2>
      {selectedOrder == null ? (
        <p>Select an order to see more details.</p>
      ) : (
        <div>
          <h3>{selectedOrder.NameOfTheOrder}</h3>
          <h3>{selectedOrder.Description}</h3>
        </div>
      )}
    </div>
  );
}

export default OverallOrdersDescription;
