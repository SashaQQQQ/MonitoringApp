import { useEffect, useState } from "react";
import OverallOrdersList from "./OrderPreview/OverallOrderList.jsx";
import OverallOrdersDescription from "./OrderPreview/OverallOrderDescription.jsx";
import AddOrderForm from "./AddingOrderComponents/AddOrderForm.jsx";
import MyCalendar from "./SpecialComponents/Calendar.jsx";
import emptyIcon from "../Icons/empty.png";
import "../Styles/OrdersPage.css";
import { supabase } from "./SupabaseClient.js";
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
        
  
  
    
        setOrders(data);
       setCalendarOrders(data);
      }
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
              <OverallOrdersDescription setSelectedOrder={setSelectedOrder} fetchOrders={fetchOrders} selectedOrder={selectedOrder} />
            ) : <div className="noOrderSelected">
            
                      <h4>Select an order to see details</h4>
                     <img src={emptyIcon} alt="No order selected"/>
                     </div>}
          </div>
        </div>
      ) : (
        <AddOrderForm setAddOrderFormStatus={setAddOrderFormStatus} />
      )}
    </div>
  );
}

export default OrdersPageOwner;
