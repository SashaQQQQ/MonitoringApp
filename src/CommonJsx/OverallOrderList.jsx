import { useState, useEffect, use } from "react";
import { supabase } from "./SupabaseClient.js";
import "../Styles/OrdersPage.css";

function OverallOrdersPage({ handleOrderClick }) {
  const [orders, setOrders] = useState(null);

  async function fetchOrders() {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      console.error("Error fetching orders:", error);
    }
    if (!error) {
      console.log("Orders fetched successfully:", data);
    }
    if (data) {
      setOrders(data);
    }
  }
  async function deleteOrder(orderId) {
    console.log("Deleting order with ID:", orderId);
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
    } else {
      alert("Order deleted successfully");
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
            <div>
              <p>{order.NameOfTheOrder} |</p>
              <p>Progress:{order.status}</p>
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
