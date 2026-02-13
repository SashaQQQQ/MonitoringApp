import { useState, useEffect, use } from "react";

import "./Styles/App.css";
import LogInPage from "./CommonJsx/LogInPage.jsx";
import OwnerMainPage from "./OwnerJsx/OwnerMainPage.jsx";
import WorkerMainPage from "./WorkerJsx/WorkerMainPage.jsx";
function App() {
  const [whichRole, setWhichRole] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    if (userProfile) {
      setWhichRole(userProfile[0].Role);
    }
  }, [userProfile]);
  return (
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
  );
}

export default App;
