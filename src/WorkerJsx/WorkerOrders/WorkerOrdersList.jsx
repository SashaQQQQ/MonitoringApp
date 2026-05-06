import { useState, useEffect, useContext, useCallback } from "react";

const WorkerOrdersList = ({
  orders,
  setOrders,
  setActivePanel,
  setSelectedOrder,
}) => {
  return (
    <>
      {orders && orders.length > 0 ? <h4>Click to see the details</h4> : null}
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => {
            return (
              <li
                onClick={() => {
                  setSelectedOrder(() => {
                    console.log(order);
                    return order;
                  });
                  setActivePanel("details");
                }}
                key={order.id}
              >
                <p>{order.Title}</p>
                <p>{order.FinalDate}</p>
              </li>
            );
          })
        ) : (
          <li>No orders found.</li>
        )}
      </ul>
    </>
  );
};

export default WorkerOrdersList;
