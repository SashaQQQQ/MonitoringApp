import { useState, useEffect, use } from "react";
import { supabase } from "../SupabaseClient.js";
import "../../Styles/OrdersPage.css";
import plusIcon from "../../Icons/plus.png";

function OverallOrdersPage({ setAddOrderFormStatus, handleOrderClick, fetchOrders, orders }) {


  
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="ordersList">
      <img
        className="extBtn"
        onClick={() => setAddOrderFormStatus(true)}
        src={plusIcon}
      />

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
              <p>{order.FinalDate}</p>
            </div>
          
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OverallOrdersPage;
