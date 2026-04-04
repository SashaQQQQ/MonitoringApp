import { useContext, useEffect, useState } from "react";
import { DataContext } from "../DataContext.jsx";
import "../../Styles/ChatList.css";
import personIcon from "../../Icons/worker.png";
import { supabase } from "../SupabaseClient.js";
export default function ChatList({ chatList, getOtherUser, loadChatList }) {
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  function renderItems(item, isSearch = false) {
    const date = item?.time ? new Date(item.time) : null;
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    return (
      <li key={item.id} onClick={() => getOtherUser(item)}>
        <img src={personIcon} alt="" />
        <p className="nameOfChat">
          {item?.name + " "}
          {item?.secondName}
        </p>
        <p className="lastMessage">
          {isSearch
            ? "Start chat"
            : item?.lastMessage.length > 13
              ? item?.lastMessage.slice(0, 13) + ".."
              : item?.lastMessage}
        </p>

        <p className="chatDate">
          {isSearch
            ? "New"
            : isToday
              ? date.toLocaleDateString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : date.toLocaleDateString([], {
                  day: "2-digit",
                  month: "2-digit",
                })}
        </p>
      </li>
    );
  }

  function handleSearch(e) {
    setCurrentSearch(e);
  }

  async function fetchSearchedUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("name", `%${currentSearch}%`);

    if (error) {
      console.log("error while fetching searched users");
      return;
    }

    setSearchedUsers(data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentSearch.trim()) {
        fetchSearchedUsers();
      } else {
        setSearchedUsers([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentSearch]);

  useEffect(() => {
    loadChatList();
  }, []);
  return (
    <div className="ChatList">
      <div className="chatListSearch">
        <input
          type="text"
          placeholder="Input worker name"
          onInput={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <ul>
        {searchedUsers.length > 0 ? (
          searchedUsers.map((user) => renderItems(user, true))
        ) : chatList.length > 0 ? (
          chatList.map((chat) => renderItems(chat))
        ) : (
          <p>No chats yet</p>
        )}
      </ul>
    </div>
  );
}
