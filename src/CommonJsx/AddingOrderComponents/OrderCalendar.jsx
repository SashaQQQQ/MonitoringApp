import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Styles/MyCalendar.css";

function OrderCalendar({ getFinalDate }) {
  const [value, setValue] = useState(new Date());
  const [isoDate, setIsoDate] = useState("");

  const formatDay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const handleChange = (date) => {
    const formattedDate = formatDay(date);

    setValue(date);
    setIsoDate(formattedDate);
    getFinalDate(formattedDate);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar minDate={new Date()} value={value} onChange={handleChange} />

      <h3>Chosen date: {isoDate}</h3>
    </div>
  );
}

export default OrderCalendar;
