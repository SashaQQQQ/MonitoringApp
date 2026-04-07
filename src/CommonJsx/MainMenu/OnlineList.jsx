import { supabase } from "../SupabaseClient";
import { useState, useEffect, useContext } from "react";
import "../../Styles/MainMenuCss/OnlineList.css";
import { DataContext } from "../DataContext";
const OnlineList = () => {
  const { userProfile } = useContext(DataContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  async function fetchOnlineUsers() {
    const now = new Date();
    const onlineCheck = new Date(now.getTime() - 60000).toISOString();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .gte("lastSeen", onlineCheck);

    setOnlineUsers(data);
  }

  useEffect(() => {
    const myInterval = setInterval(() => {
      fetchOnlineUsers();
    }, 10000);

    return () => clearInterval(myInterval);
  }, []);

  return (
    <div className="OnlineList">
      <h4>Now online {onlineUsers.length}</h4>
      <ul>
        {onlineUsers.length > 0
          ? onlineUsers.map((user) => {
              if (user.id === userProfile.id) return null;

              return (
                <li key={user.id}>
                  <p>
                    {user.name} {user.secondName}
                  </p>
                  <p>{user.Role}</p>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default OnlineList;
