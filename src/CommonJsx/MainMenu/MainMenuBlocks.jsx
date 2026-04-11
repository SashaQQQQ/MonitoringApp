import BestWorkers from "./BestWorkers.jsx";
import EndingOrders from "./EndingOrders.jsx";
import OnlineList from "./OnlineList.jsx";

const MainMenuBlock = () => {
  return (
    <>
      <div className="main">
        <div className="ordersToEndFastPanel">
          <h3 className="panelTitle">Ending orders</h3>
          <EndingOrders />
        </div>
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
      </div>
    </>
  );
};

export default MainMenuBlock;
