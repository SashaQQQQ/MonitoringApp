import { useEffect, useState } from "react";
import OverallOrdersList from "../CommonJsx/OrderPreview/OverallOrderList.jsx";
import OverallOrdersDescription from "../CommonJsx/OrderPreview/OverallOrderDescription.jsx";
import AddOrderForm from "../CommonJsx/AddOrderForm.jsx";
import MyCalendar from "../CommonJsx/Calendar.jsx";
import plusIcon from "../Icons/plus.png";

import "../Styles/OrdersPage.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";
function OrdersPageOwner() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addOrderFormStatus, setAddOrderFormStatus] = useState(false);
  const [orders, setOrders] = useState([]);

  function handleOrderClick(order) {
    setSelectedOrder(order);
  }
  async function fetchProcents() {
    const { data, error } = await supabase
      .from("order.Workers")
      .select("progress_percent")
      .eq("order_id", selectedOrder?.id);

    const totalProgress = data.reduce(
      (sum, worker) => sum + worker.progress_percent,
      0,
    );

    const averageProcent =
      data && data.length > 0 ? totalProgress / data.length : 0;

    setSelectedOrder((prev) =>
      prev ? { ...prev, readyProcent: averageProcent } : prev,
    );
  }
  useEffect(() => {
    if (!selectedOrder?.id) return;
    fetchProcents();
  }, [selectedOrder?.id]);
  return (
    <div className="ordersPage">
      {!addOrderFormStatus ? (
        <div className="ordersContainer">
          <img
            className="extBtn"
            onClick={() => setAddOrderFormStatus(true)}
            src={plusIcon}
          />

          <div className="ordersContent">
            <div className="ordersInfoCont">
              <MyCalendar orders={orders} />
              <OverallOrdersList
                setCalendarOrders={setOrders}
                handleOrderClick={handleOrderClick}
              />
            </div>
            {selectedOrder ? (
              <OverallOrdersDescription selectedOrder={selectedOrder} />
            ) : null}
          </div>
        </div>
      ) : (
        <AddOrderForm setAddOrderFormStatus={setAddOrderFormStatus} />
      )}
    </div>
  );
}

export default OrdersPageOwner;
