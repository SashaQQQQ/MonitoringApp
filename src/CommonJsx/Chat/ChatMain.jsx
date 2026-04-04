import { useState, useEffect, useContext } from "react";
import { supabase } from "../SupabaseClient.js";
import { DataContext } from "../DataContext.jsx";
import ChatList from "./ChatList.jsx";
import ChatWindow from "./ChatWindow.jsx";
import "../../Styles/Chat.css";

function Chat() {
  const { userProfile, otherUser, setOtherUser, loading } =
    useContext(DataContext);
  const [chatList, setChatList] = useState([]);
  if (loading) return <div>Loading...</div>;
  async function loadChatList() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender.eq."${userProfile.email}",receiver.eq."${userProfile.email}"`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const dialogs = new Map();

    for (const msg of data) {
      const partner =
        msg.sender === userProfile.email ? msg.receiver : msg.sender;

      if (!dialogs.has(partner)) {
        dialogs.set(partner, {
          email: partner,
          lastMessage: msg.message,
          time: msg.created_at,
        });
      }
    }
    const dialogArray = Array.from(dialogs.values());
    const emails = dialogArray.map((dialog) => dialog.email);
    const { data: finalData, error: finalError } = await supabase
      .from("users")
      .select("*")
      .in("email", emails);

    if (finalError) {
      console.log("failed to fetch users names");
      return;
    }

    const combined = dialogArray.map((d) => {
      const user = finalData.find((u) => u.email === d.email) || [];
      return { ...d, name: user.name, secondName: user.secondName };
    });

    setChatList(combined);
  }

  return (
    <div className="chatContainer">
      <ChatList
        chatList={chatList}
        loadChatList={loadChatList}
        getOtherUser={setOtherUser}
      />
      <ChatWindow loadChatList={loadChatList} otherUser={otherUser} />
    </div>
  );
}

export default Chat;
