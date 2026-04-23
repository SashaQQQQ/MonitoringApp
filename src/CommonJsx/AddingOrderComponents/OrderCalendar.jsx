import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Styles/MyCalendar.css";

function OrderCalendar({ getFinalDate }) {
  const [value, setValue] = useState(new Date());
  const [isoDate, setIsoDate] = useState("");

  const handleChange = (date) => {
    setValue(date);

    const iso = date.toISOString().split("T")[0];
    getFinalDate(iso);
    setIsoDate(iso);

    console.log(iso);
  };

  return (
    <div className="orderCalendar-wrapper">
      <h3>Select final date</h3>
      <Calendar minDate={new Date()} value={value} onChange={handleChange} />

      <h3>Chosen date: {isoDate}</h3>
    </div>
  );
}

export default OrderCalendar;
