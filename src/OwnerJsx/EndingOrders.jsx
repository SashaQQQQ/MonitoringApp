import { useEffect, useState } from "react";

import "../Styles/EndingOrders.css";
import { supabase } from "../CommonJsx/SupabaseClient.js";

function EndingOrders() {
  const [endingOrders, setEndingOrders] = useState([]);

  async function fetchEndingOrders() {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      console.error("Error fetching ending orders:", error);
      return;
    }
    console.log("All orders fetched successfully:", data);
    const now = new Date();

    const endingSoon = data
      .filter((order) => new Date(order.end_time) > now) // только не завершённые
      .sort((a, b) => new Date(a.end_time) - new Date(b.end_time)) // ближайшие сверху
      .slice(0, 5); // только 5

    setEndingOrders(endingSoon);

    console.log("Ending orders fetched successfully:", endingSoon);
  }
  useEffect(() => {
    fetchEndingOrders();
  }, []);
  return (
    <div className="EndingOrders">
      {endingOrders.length > 0 ? (
        endingOrders.map((order) => (
          <div key={order.id} className="orderCard">
            <div className="orderInfo">
              <p>{order.NameOfTheOrder}</p>
              <p>End time: {new Date(order.end_time).toLocaleString()}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No ending orders found</p>
      )}
    </div>
  );
}

export default EndingOrders;
