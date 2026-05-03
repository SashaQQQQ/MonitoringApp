import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "../../Styles/MyCalendar.css";
const UniversalCalendar = ({ mode, getDate, orders }) => {
  const [value, setValue] = useState(new Date());
  const [isoDate, setIsoDate] = useState("");

  const handleChange = (date) => {
    setValue(date);
    if (mode !== "select") return;
    const formattedDate = formatDay(date);
    setIsoDate(formattedDate);
    getDate(formattedDate);
  };

  const formatDay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const datesSet = useMemo(() => {
    if (mode !== "orders") return new Set();
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
        value={value}
        onChange={handleChange}
        minDate={new Date()}
        tileClassName={({ date }) =>
          mode === "orders" && datesSet.has(getKey(date)) ? "has-order" : null
        }
        tileContent={({ date }) => {
          if (mode !== "orders") return null;
          if (!datesSet.has(getKey(date))) return null;
          return <div className="dot" />;
        }}
      />

      {mode === "select" && <h3>Chosen date: {isoDate}</h3>}
    </div>
  );
};

export default UniversalCalendar;
