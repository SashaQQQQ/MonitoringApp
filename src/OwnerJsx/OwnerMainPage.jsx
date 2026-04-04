import { useContext, useState } from "react";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import WorkersListPage from "../WorkerJsx/WorkersListPage.jsx";
import AddWorker from "../CommonJsx/AddWorker.jsx";
import OrdersPageOwner from "./OrdersPageOwner.jsx";
import NavigationBar from "../CommonJsx/NavigationBar.jsx";
import ProfilePreview from "../CommonJsx/ProfilePreview.jsx";
import ChatMain from "../CommonJsx/Chat/ChatMain.jsx";
import BestWorkers from "./BestWorkers.jsx";
import EndingOrders from "./EndingOrders.jsx";
import "../Styles/MainPage.css";

function OwnerMainPage() {
  const [contactPerson, setContactPerson] = useState(null);
  const { userProfile, activePage, loading } = useContext(DataContext);
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="userWindow">
        <NavigationBar />
      </div>
      <h1 className="greetings">Welcome on board!</h1>
      <div className="mainContent">
        {activePage === "main" ? (
          <div className="main">
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
                <h3 className="panelTitle">Ending orders</h3>
                <EndingOrders />
              </div>
              <div className="lastWorkersPanel">
                <h3 className="panelTitle">Last workers</h3>
              </div>
            </div>
          </div>
        ) : null}
        {activePage === "workers" ? <WorkersListPage /> : null}
        {activePage === "addWorker" ? <AddWorker /> : null}
        {activePage === "orders" ? <OrdersPageOwner /> : null}
        {activePage === "chats" ? (
          <ChatMain
            contactPerson={contactPerson}
            setContactPerson={setContactPerson}
          />
        ) : null}
      </div>

      {userProfile ? <ProfilePreview userProfile={userProfile} /> : null}
    </div>
  );
}

export default OwnerMainPage;
