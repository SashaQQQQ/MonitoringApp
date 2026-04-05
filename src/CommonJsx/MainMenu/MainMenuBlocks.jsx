import BestWorkers from "./BestWorkers.jsx";
import EndingOrders from "./EndingOrders.jsx";
import OnlineList from "./OnlineList.jsx";
import { DataContext } from "../DataContext.jsx";
import { useState, useEffect, useContext } from "react";
const MainMenuBlock = () => {
  const { userProfile } = useContext(DataContext);
  return (
    <div className="main">
      <div className="horizontalPanel">
        <div className="bestWorkersPanel">
          <h3 className="panelTitle">Best workers..</h3>
          <BestWorkers />
        </div>

        <div className="OnlineListContainer">
          <h3 className="panelTitle">Workers online</h3>

          <OnlineList />
        </div>
      </div>
      <div className="horizontalPanel">
        <div className="ordersToEndFastPanel">
          <h3 className="panelTitle">Ending orders</h3>
          <EndingOrders />
        </div>
        {userProfile.Role === "Owner" || userProfile.Role === "Admin" ? (
          <div className="lastWorkersPanel">
            <h3 className="panelTitle">Last workers</h3>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MainMenuBlock;
