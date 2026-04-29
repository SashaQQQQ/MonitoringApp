import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Styles/MyCalendar.css";

function MyCalendar({ orders }) {
  const [value, setValue] = useState(new Date());

  const getDatesSet = () => {
    const set = new Set();

    orders.forEach((order) => {
      if (!order.FinalDate) return;

      const d = new Date(order.FinalDate);
      if (isNaN(d)) return;

      const key =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0");
      set.add(key);
    });

    return set;
  };

  const datesSet = getDatesSet();

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={setValue}
        value={value}
        height={"300px"}
        tileContent={({ date }) => {
          const key =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");

          if (!datesSet.has(key)) return null;

          return <div className="dot red"></div>;
        }}
      />
    </div>
  );
}

export default MyCalendar;
