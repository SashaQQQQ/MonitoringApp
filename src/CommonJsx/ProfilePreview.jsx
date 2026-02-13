import { useState, useEffect, use } from "react";

import "../Styles/MainPage.css";

function ProfilePreview({ userProfile }) {
  return (
    <div className="userProfilePreview">
      <div>
        <p>{userProfile?.name || "N/A"}</p>
        <p>{userProfile?.secondName || "N/A"}</p>
      </div>
      <img src="dsfsf" alt="picture" />
    </div>
  );
}

export default ProfilePreview;
