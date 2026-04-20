import { useState, useEffect, useContext } from "react";
import userIcon from "../Icons/worker.png";
import "../Styles/MainPage.css";
import { DataContext } from "./DataContext.jsx";
function ProfilePreview({ }) {
  const { userProfile, setActivePage } = useContext(DataContext);
  return (
    <div onClick={() => setActivePage("editingProfile")} className="userProfilePreview">
      <img src={userProfile.avatarUrl||userIcon} alt="picture" />
      <div>
        <p>
          {userProfile?.name || "N/A"} {userProfile?.secondName}
          {" || "} {userProfile?.Role}
        </p>
      </div>
    </div>
  );
}

export default ProfilePreview;
