import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../Styles/MyCalendar.css";

function ActionConfirmation({ textToShow }) {
  return (
    <div className="ActionConfirmation">
      <p>{textToShow}</p>
      <button>Hide</button>
    </div>
  );
}

export default MyCalendar;
