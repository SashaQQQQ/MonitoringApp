import { useState } from "react";

import WorkersListPage from "../WorkerJsx/WorkersListPage.jsx";
import AddWorker from "../CommonJsx/AddWorker.jsx";
import OrdersPageOwner from "./OrdersPageOwner.jsx";
import NavigationBar from "../CommonJsx/NavigationBar.jsx";
import ProfilePreview from "../CommonJsx/ProfilePreview.jsx";
import ChatMain from "../CommonJsx/ChatMain.jsx";
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

      <div className="mainContent">
        {activePage === "addWorker" && <AddWorker />}
        {activePage === "workers" && (
          <WorkersListPage userProfile={userProfile} />
        )}
        {activePage === "orders" && <OrdersPageOwner />}
        {activePage === "chats" && <ChatMain userProfile={userProfile} />}
        {activePage === null && (
          <div className="welcomeText">
            <h1>Welcome, {userProfile[0]?.name || "Owner"}!</h1>
            <p>What will be your decision?</p>
          </div>
        )}
      </div>

      <ProfilePreview userProfile={userProfile[0]} />
    </div>
  );
}

export default OwnerMainPage;
