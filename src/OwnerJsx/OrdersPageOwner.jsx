import { useState } from "react";
import OverallOrdersList from "../CommonJsx/OverallOrderList.jsx";
import OverallOrdersDescription from "../CommonJsx/OverallOrderDescription.jsx";
import AddOrderForm from "../CommonJsx/AddOrderForm.jsx";

import "../Styles/OrdersPage.css";

function OrdersPageOwner() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addOrderFormStatus, setAddOrderFormStatus] = useState(false);

  function handleOrderClick(order) {
    setSelectedOrder(order);
  }

  return (
    <div className="ordersPage">
      {!addOrderFormStatus ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            height: "100%",
            gap: "25px",
          }}
        >
          <button
            style={{ width: "10%", height: "10%" }}
            onClick={() => setAddOrderFormStatus(true)}
          >
            Add Order
          </button>
          <OverallOrdersList handleOrderClick={handleOrderClick} />
          <OverallOrdersDescription selectedOrder={selectedOrder} />
        </div>
      ) : (
        <AddOrderForm setAddOrderFormStatus={setAddOrderFormStatus} />
      )}
    </div>
  );
}

export default OrdersPageOwner;
