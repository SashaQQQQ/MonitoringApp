import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Styles/MyCalendar.css";

function MyCalendar({ orders }) {
  const [value, setValue] = useState(new Date());

  const datesSet = useMemo(() => {
    const set = new Set();

    orders.forEach((order) => {
      if (!order.FinalDate) return;

      const d = new Date(order.FinalDate);
      if (isNaN(d)) return;

      const key = d.toISOString().split("T")[0];
      set.add(key);
    });

    return set;
  }, [orders]);

  const getKey = (date) => date.toISOString().split("T")[0];

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={setValue}
        value={value}
        minDate={new Date()}
        // 🔥 добавляем класс для дней с заказами
        tileClassName={({ date }) => {
          return datesSet.has(getKey(date)) ? "has-order" : null;
        }}
        // 🔴 точка
        tileContent={({ date }) => {
          if (!datesSet.has(getKey(date))) return null;
          return <div className="dot" />;
        }}
      />
    </div>
  );
}

export default MyCalendar;
