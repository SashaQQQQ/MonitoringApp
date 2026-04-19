import { useContext, useEffect, useState } from "react";
import { DataContext } from "../DataContext.jsx";
import WorkersListPage from "../../WorkerJsx/WorkersListPage.jsx";
import AddWorker from "../AddWorker.jsx";
import OrdersPageOwner from "../OrdersPageOwner.jsx";
import NavigationBar from "../NavigationBar.jsx";
import ProfilePreview from "../ProfilePreview.jsx";
import ChatMain from "../Chat/ChatMain.jsx";
import MainMenuBlock from "./MainMenuBlocks.jsx";
import "../../Styles/MainPage.css";
import { refreshOnlineStatus } from "../../App.jsx";
import WorkerOrdersPage from "../../WorkerJsx/WorkerOrders/WorkerOrderPage.jsx";
function MainPage() {
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
        {activePage === "main" && <MainMenuBlock />}
        {activePage === "workers"  ? <WorkersListPage /> : null}
   
        {activePage === "addWorker" && (userProfile.Role === "Owner" || userProfile.Role === "Admin") ? <AddWorker /> : null}
        {activePage === "orders" && (userProfile.Role === "Owner" || userProfile.Role === "Admin") ? <OrdersPageOwner /> : null}
            {activePage === "orders" && userProfile.Role === "Worker" ? <WorkerOrdersPage /> : null}
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

export default MainPage;
