import { useState, useEffect, useContext } from "react";
import { supabase } from "./SupabaseClient";
import { DataContext } from "./DataContext.js";
import ChatList from "./ChatList.jsx";
import ChatWindow from "./ChatWindow.jsx";
import "../Styles/Chat.css";
function Chat() {
  const [otherUser, setOtherUser] = useState(0);
  const { userProfile } = useContext(DataContext);

  async function loadChatList() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `sender.eq.${userProfile[0].login},receiver.eq.${userProfile[0].login}`,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const dialogs = new Map();

    for (const msg of data) {
      const partner =
        msg.sender === userProfile[0].login ? msg.receiver : msg.sender;

      if (!dialogs.has(partner)) {
        dialogs.set(partner, {
          login: partner,
          lastMessage: msg.message,
          time: msg.created_at,
        });
      }
    }

    setChatList([...dialogs.values()]);
  }

  return (
    <div className="chatContainer">
      <ChatList loadChatList={loadChatList} getOtherUser={setOtherUser} />
      <ChatWindow loadChatList={loadChatList} otherUser={otherUser} />
    </div>
  );
}

export default Chat;
