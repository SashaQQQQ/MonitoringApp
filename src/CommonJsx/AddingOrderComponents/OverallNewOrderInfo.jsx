import { useState, useEffect } from "react";

import "../../Styles/AddOrdersForm.css";

function OverallNewOrderInfo({
  newOrderName,
  setNewOrderName,
  newOrderDescription,
  setNewOrderDescription,
}) {
  function handleOrderTitleChange(e) {
    setNewOrderName(e.target.value);
  }

  function handleOrderDescriptionChange(e) {
    setNewOrderDescription(e.target.value);
  }
  return (
    <>
      <div className="inputOrderGroup">
        <div className="labelGroup">
          <h3>Title of the order</h3>
        </div>
        <input
          value={newOrderName}
          type="text"
          placeholder="Please, enter the title.."
          onInput={(e) => {
            handleOrderTitleChange(e);
          }}
        />
      </div>

      <div className="inputOrderGroup">
        <div className="labelGroup">
          <h3>Description of the order</h3>
        </div>
        <textarea
          value={newOrderDescription}
          placeholder="Describe the order..."
          onInput={(e) => {
            handleOrderDescriptionChange(e);
          }}
        />
      </div>
    </>
  );
}

export default OverallNewOrderInfo;
