import { useEffect, useState } from "react";

import NavigationBar from "../CommonJsx/NavigationBar.jsx";
import ProfilePreview from "../CommonJsx/ProfilePreview.jsx";
import WorkerOrderPage from "./WorkerOrderPage.jsx";
import WorkersListPage from "./WorkersListPage.jsx";
import ChatMain from "../CommonJsx/ChatMain.jsx";
import "../Styles/MainPage.css";

function WorkerMainPage({ userProfile }) {
  const [activePage, setActivePage] = useState(null);
  useEffect(() => {
    console.log("WorkerMainPage userProfile:", userProfile);
  }, []);
  return (
    <div>
      <div className="userWindow">
        <NavigationBar
          role={userProfile[0]?.Role}
          setActivePage={setActivePage}
        />
      </div>

      <div className="mainContent">
        {activePage === "workers" && (
          <WorkersListPage userProfile={userProfile} />
        )}
        {activePage === "orders" && (
          <WorkerOrderPage
            SetActivePage={setActivePage}
            userProfile={userProfile}
          />
        )}
        {activePage === "chats" && <ChatMain userProfile={userProfile} />}
        {activePage === "settings" && <SettingsPage />}
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

export default WorkerMainPage;
