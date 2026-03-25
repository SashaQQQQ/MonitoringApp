import { useState, useEffect, use } from "react";
import { DataContext } from "./CommonJsx/DataContext.js";
import "./Styles/App.css";
import LogInPage from "./CommonJsx/LogInPage.jsx";
import OwnerMainPage from "./OwnerJsx/OwnerMainPage.jsx";
import WorkerMainPage from "./WorkerJsx/WorkerMainPage.jsx";
function App() {
  const [whichRole, setWhichRole] = useState(null);
  const [activePage, setActivePage] = useState("main");
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    if (userProfile) {
      setWhichRole(userProfile[0].Role);
    }
  }, [userProfile]);
  return (
    <DataContext.Provider
      value={{
        userProfile,
        setUserProfile,
        whichRole,
        setWhichRole,
        activePage,
        setActivePage,
      }}
    >
      <div className="App">
        {!userProfile ? (
          <LogInPage setUserProfile={setUserProfile} />
        ) : whichRole === "Owner" && userProfile ? (
          <OwnerMainPage userProfile={userProfile} />
        ) : whichRole === "Worker" && userProfile ? (
          <WorkerMainPage userProfile={userProfile} />
        ) : (
          <div>User View</div>
        )}
      </div>
    </DataContext.Provider>
  );
}

export default App;
