import { useState, useEffect, use } from "react";
import { supabase } from "../SupabaseClient.js";
import "../../Styles/OrdersPage.css";
import plusIcon from "../../Icons/plus.png";

function OverallOrdersPage({ setAddOrderFormStatus, handleOrderClick, fetchOrders, orders }) {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");

  function filterOrders(typeOfFilter) {
    console.log("Filtering orders with filter type:", typeOfFilter);
    if(typeOfFilter === "all") {
      setFilteredOrders(orders);
      return;
    }
    const now = new Date();

    const filtered = orders
    .filter((order) => {
      if (typeOfFilter === "upcoming") {
        return new Date(order.FinalDate + "T00:00:00") > now;
      } else if (typeOfFilter === "ended") {
        return new Date(order.FinalDate + "T00:00:00") < now;
      } 
    })
    .sort(
      (a, b) =>
       new Date(a.FinalDate + "T00:00:00") -
       new Date(b.FinalDate + "T00:00:00"),
   );
    setFilteredOrders(filtered);
  }

    

    function renderItemList(order) {
      if (!order) return (<p>Invalid order data</p>);
return (
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
              <p className="orderDate">{order.FinalDate}</p>
            </div>
          
          </li>
        )
        };
      
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {  
    filterOrders(filterType);
  }, [filterType, orders]);

  return (
    <div className="ordersList">
     
      <nav className="filterNaviagtion">
        <h4 className={filterType === "all" ? "clicked" : ""} onClick={() => {
          setFilterType("all");
        }}>
          All
        </h4>
        <h4 className={filterType === "upcoming" ? "clicked" : ""} onClick={() => {
          setFilterType("upcoming");
        }}>
          Upcoming
        </h4>
        <h4 className={filterType === "ended" ? "clicked" : ""} onClick={() => {
          setFilterType("ended");
        }}>
          Ended
        </h4>
       <button onClick={() => setAddOrderFormStatus(true)}>Add Order</button>
      </nav>
      <ul>
        
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => renderItemList(order))
        ) : (
          <p>No orders found</p>
        )}
         
      </ul>
    </div>
  );
}

export default OverallOrdersPage;
