import { useEffect, useState, useContext } from "react";

import NavigationBar from "../CommonJsx/NavigationBar.jsx";
import ProfilePreview from "../CommonJsx/ProfilePreview.jsx";
import WorkerOrderPage from "./WorkerOrderPage.jsx";
import WorkersListPage from "./WorkersListPage.jsx";
import ChatMain from "../CommonJsx/Chat/ChatMain.jsx";
import "../Styles/MainPage.css";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import MainMenuBlock from "../CommonJsx/MainMenu/MainMenuBlocks.jsx";
import { refreshOnlineStatus } from "../App.jsx";
function WorkerMainPage() {
  const { loading, userProfile, activePage, setActivePage } =
    useContext(DataContext);

  if (loading) return <div>Loading...</div>;
  useEffect(() => {
    refreshOnlineStatus(userProfile.id);
    const myInterval = setInterval(() => {
      refreshOnlineStatus(userProfile.id);
    }, 30000);

    return () => {
      clearInterval(myInterval);
    };
  }, []);
  useEffect(() => {
    console.log("Active page changed:", activePage);
  }, [activePage]);
  return (
    <div>
      <h1 className="greetings">Welcome on board!</h1>
      <div className="userWindow">
        <NavigationBar />
      </div>

      <div className="mainContent">
        {activePage === "main" && <MainMenuBlock />}
        {activePage === "workers" && <WorkersListPage />}
        {activePage === "orders" && <WorkerOrderPage />}
        {activePage === "chats" && <ChatMain />}
      </div>
      {userProfile ? <ProfilePreview userProfile={userProfile} /> : null}
    </div>
  );
}

export default WorkerMainPage;
