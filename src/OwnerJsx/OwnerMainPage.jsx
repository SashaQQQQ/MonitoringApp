import { useState } from "react";

import WorkersListPage from "../WorkerJsx/WorkersListPage.jsx";
import AddWorker from "../CommonJsx/AddWorker.jsx";
import OrdersPageOwner from "./OrdersPageOwner.jsx";
import NavigationBar from "../CommonJsx/NavigationBar.jsx";
import ProfilePreview from "../CommonJsx/ProfilePreview.jsx";
import ChatMain from "../CommonJsx/ChatMain.jsx";
import BestWorkers from "./BestWorkers.jsx";
import EndingOrders from "./EndingOrders.jsx";
import "../Styles/MainPage.css";

function OwnerMainPage({ userProfile }) {
  const [contactPerson, setContactPerson] = useState(null);
  const [activePage, setActivePage] = useState(null);

  return (
    <div>
      <div className="userWindow">
        <NavigationBar
          role={userProfile[0]?.Role}
          setActivePage={setActivePage}
        />
      </div>
      <h1 className="greetings">Welcome on board!</h1>
      <div className="mainContent">
        <div className="horizontalPanel">
          <div className="bestWorkersPanel">
            <h3 className="panelTitle">Best workers..</h3>
            <BestWorkers />
          </div>
          <div className="lastChatsPanel">
            <h3 className="panelTitle">Last chats</h3>
          </div>
        </div>
        <div className="horizontalPanel">
          <div className="ordersToEndFastPanel">
            <h3 className="panelTitle">Orders to end fast</h3>
            <EndingOrders />
          </div>
          <div className="lastWorkersPanel">
            <h3 className="panelTitle">Last workers</h3>
          </div>
        </div>
      </div>

      <ProfilePreview userProfile={userProfile[0]} />
    </div>
  );
}

export default OwnerMainPage;
