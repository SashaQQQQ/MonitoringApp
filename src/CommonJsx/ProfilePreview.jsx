import { useState, useEffect, use } from "react";

import "../Styles/MainPage.css";

function ProfilePreview({ userProfile }) {
  return (
    <div className="userProfilePreview">
      <img src="dsfsf" alt="picture" />
      <div>
        <p>
          {userProfile?.name || "N/A"} {userProfile?.secondName}{" "}
        </p>
      </div>
    </div>
  );
}

export default ProfilePreview;
