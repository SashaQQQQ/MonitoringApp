import { useState, useEffect, use } from "react";
import userIcon from "../Icons/worker.png";
import "../Styles/MainPage.css";

function ProfilePreview({ userProfile }) {
  return (
    <div className="userProfilePreview">
      <img src={userIcon} alt="picture" />
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
