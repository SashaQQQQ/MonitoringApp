import { useContext, useEffect, useState } from "react";
import { DataContext } from "./DataContext";

export default function ChatList({ getOtherUser, loadChatList }) {
  const { userProfile } = useContext(DataContext);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    loadChatList();
  }, []);

  return (
    <div className="ChatList">
      <ul>
        {chatList.length > 0 ? (
          chatList.map((chat, index) => (
            <li
              onClick={() => {
                getOtherUser(chat.login);
              }}
              key={chat}
            >
              <p>{chat?.login}</p>

              <p>{chat?.lastMessage}</p>
              <p>{chat?.time}</p>
            </li>
          ))
        ) : (
          <p>No chats yet</p>
        )}
      </ul>
    </div>
  );
}
