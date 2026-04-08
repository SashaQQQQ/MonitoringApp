import { useState, useEffect, use } from "react";
import { supabase } from "../SupabaseClient.js";
import "../../Styles/OrdersPage.css";

function OverallOrdersPage({ setCalendarOrders, handleOrderClick }) {
  const [orders, setOrders] = useState(null);

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
  async function deleteOrder(orderId) {
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
    } else {
      const { data: finalStepData, error: finalStepError } = await supabase
        .from("order.Workers")
        .delete()
        .eq("order_id", orderId);
      if (finalStepError) {
        console.error("Error deleting order workers:", finalStepError);
      }
      fetchOrders();
    }
  }
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="ordersList">
      <ul>
        {orders?.map((order, index) => (
          <li
            key={order.id}
            onClick={() => {
              handleOrderClick(order);
            }}
          >
            <div className="orderInfo">
              <p>
                {order.Title.length > 25
                  ? order.Title.slice(0, 25) + ".."
                  : order.Title}{" "}
              </p>
            </div>
            <button
              onClick={() => {
                deleteOrder(order.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OverallOrdersPage;
