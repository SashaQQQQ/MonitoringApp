import { use, useEffect, useState } from "react";

import "../../Styles/MainMenuCss/EndingOrders.css";
import { supabase } from "../SupabaseClient.js";

function EndingOrders() {
  const [endingOrders, setEndingOrders] = useState([]);

  useEffect(() => {
    fetchEndingOrders();
    const interval = setInterval(() => {
      fetchEndingOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function fetchEndingOrders() {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      console.error("Error fetching ending orders:", error);
      return;
    }

    const now = new Date();

    const endingSoon = data
      .filter((order) => new Date(order.FinalDate + "T00:00:00") > now)
      .sort(
        (a, b) =>
          new Date(a.FinalDate + "T00:00:00") -
          new Date(b.FinalDate + "T00:00:00"),
      )
      .slice(0, 5);

    const { data: workersData, error: workersError } = await supabase
      .from("order.Workers")
      .select("order_id, progress_percent");

    if (workersError) {
      console.error("Error fetching workers:", workersError);
      return;
    }

    const ordersWithProgress = endingSoon.map((order) => {
      const orderWorkers = workersData.filter((w) => w.order_id === order.id);

      if (orderWorkers.length === 0) {
        return { ...order, progress: 0 };
      }

      const avg =
        orderWorkers.reduce((sum, w) => sum + w.progress_percent, 0) /
        orderWorkers.length;

      return {
        ...order,
        progress: Math.round(avg),
      };
    });

    setEndingOrders(ordersWithProgress);
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
              <p>{order.Title}</p>
            </div>
            <div className="orderStats">
              <p className="endingOrderProgress">Done: {order.progress}%</p>
              <p className="endingTime">
                {new Date(order.FinalDate).toISOString().split("T")[0]}
              </p>
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
