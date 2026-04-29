import { useEffect, useState } from "react";
import OverallOrdersList from "./OverallOrderList.jsx";
import OverallOrdersDescription from "./OverallOrderDescription.jsx";
import AddOrderForm from "../AddingOrderComponents/AddOrderForm.jsx";
import MyCalendar from "../SpecialComponents/Calendar.jsx";
import emptyIcon from "../../Icons/empty.png";
import "../../Styles/OrdersPage.css";
import { supabase } from "../SupabaseClient.js";
function OrdersPageOwner() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addOrderFormStatus, setAddOrderFormStatus] = useState(false);
  const [orders, setOrders] = useState([]);
  const [calendarOrders, setCalendarOrders] = useState([]);
  function handleOrderClick(order) {
    setSelectedOrder(order);
  }

  async function fetchOrders() {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      console.error("Error fetching orders:", error);
    }

    if (data) {
      console.log("Fetched orders:", data);
      const ordersWithProcent = await Promise.all(
        data.map(async (order) => {
          const procent = await fetchProcents(order.id);
          return { ...order, progress_percent: procent };
        }),
      );
      setOrders(ordersWithProcent);
      setCalendarOrders(ordersWithProcent);
    }
  }

  async function fetchProcents(orderId) {
    const { data, error } = await supabase
      .from("order.Workers")
      .select("progress_percent")
      .eq("order_id", orderId);

    if (error) {
      return 0;
    }
    const totalProgress = data.reduce(
      (sum, worker) => sum + worker.progress_percent,
      0,
    );

    return data.length > 0 ? totalProgress / data.length : 0;
  }

  return (
    <div className="ordersPage">
      {!addOrderFormStatus ? (
        <div className="ordersContainer">
          <div className="ordersContent">
            <div className="ordersInfoCont">
              <MyCalendar orders={calendarOrders} />
              <OverallOrdersList
                setAddOrderFormStatus={setAddOrderFormStatus}
                fetchOrders={fetchOrders}
                orders={orders}
                handleOrderClick={handleOrderClick}
              />
            </div>
            {selectedOrder ? (
              <OverallOrdersDescription
                setSelectedOrder={setSelectedOrder}
                fetchOrders={fetchOrders}
                selectedOrder={selectedOrder}
              />
            ) : (
              <div className="noOrderSelected">
                <h4>Select an order to see details</h4>
                <img src={emptyIcon} alt="No order selected" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <AddOrderForm setAddOrderFormStatus={setAddOrderFormStatus} />
      )}
    </div>
  );
}

export default OrdersPageOwner;
