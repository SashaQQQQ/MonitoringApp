import { useContext, useEffect, useState } from "react";
import { DataContext } from "../CommonJsx/DataContext.jsx";
import WorkersListPage from "../WorkerJsx/WorkersListPage.jsx";
import AddWorker from "../CommonJsx/AddWorker.jsx";
import OrdersPageOwner from "./OrdersPageOwner.jsx";
import NavigationBar from "../CommonJsx/NavigationBar.jsx";
import ProfilePreview from "../CommonJsx/ProfilePreview.jsx";
import ChatMain from "../CommonJsx/Chat/ChatMain.jsx";
import MainMenuBlock from "../CommonJsx/MainMenu/MainMenuBlocks.jsx";
import "../Styles/MainPage.css";
import { refreshOnlineStatus } from "../App.jsx";
function OwnerMainPage() {
  const [contactPerson, setContactPerson] = useState(null);
  const { userProfile, activePage, loading } = useContext(DataContext);

  useEffect(() => {
    if (!userProfile) return;
    refreshOnlineStatus(userProfile.id);
    const myInterval = setInterval(() => {
      refreshOnlineStatus(userProfile.id);
    }, 30000);

    return () => {
      clearInterval(myInterval);
    };
  }, [userProfile]);
  if (loading) return <div>Loading...</div>;

  return (
    <div className="userWindow">
      <NavigationBar />

      <h1 className="greetings">Welcome on board!</h1>
      <div className="mainContent">
        <div className="scrollContainer">
          {activePage === "main" && <MainMenuBlock />}
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
      </div>

      {userProfile ? <ProfilePreview userProfile={userProfile} /> : null}
    </div>
  );
}

export default OwnerMainPage;
