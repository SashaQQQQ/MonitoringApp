import { useState } from "react";
import OverallOrdersList from "../CommonJsx/OverallOrderList.jsx";
import OverallOrdersDescription from "../CommonJsx/OverallOrderDescription.jsx";
import AddOrderForm from "../CommonJsx/AddOrderForm.jsx";
import MyCalendar from "../CommonJsx/Calendar.jsx";
import backIcon from "../Icons/backArrow.png";
import "../Styles/OrdersPage.css";

function OrdersPageOwner() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addOrderFormStatus, setAddOrderFormStatus] = useState(false);
  const [orders, setOrders] = useState([]);

  function handleOrderClick(order) {
    setSelectedOrder(order);
  }

  return (
    <div className="ordersPage">
      {!addOrderFormStatus ? (
        <div className="ordersContainer">
          <img
            className="extBtn"
            onClick={() => setAddOrderFormStatus(true)}
            src={backIcon}
          />

          <div className="ordersContent">
            <MyCalendar orders={orders} />
            <OverallOrdersList
              setCalendarOrders={setOrders}
              handleOrderClick={handleOrderClick}
            />
          </div>
          <OverallOrdersDescription selectedOrder={selectedOrder} />
        </div>
      ) : (
        <AddOrderForm setAddOrderFormStatus={setAddOrderFormStatus} />
      )}
    </div>
  );
}

export default OrdersPageOwner;
