import { useEffect, useState, useContext } from "react";
import { supabase } from "../SupabaseClient.js";
import { DataContext } from "../DataContext.jsx";
import userIcon from "../../Icons/worker.png";
import "../../Styles/ChatCss/ChatWindow.css";

export default function ChatWindow({
  activeView,
  goBack,
  loadChatList,
  otherUser,
}) {
  const { userProfile } = useContext(DataContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function loadMessages(partner) {
    if (!partner) return;

    const me = String(userProfile.email);
    const other = String(partner);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender.eq.${me},receiver.eq.${other}),and(sender.eq.${other},receiver.eq.${me})`,
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setMessages(data || []);
  }

  async function sendMessage() {
    if (!text.trim() || !otherUser) return;
    console.log({
      sender: userProfile.email,
      receiver: otherUser?.email,
      message: text,
    });
    const { error } = await supabase.from("messages").insert({
      sender: userProfile.email,
      receiver: otherUser?.email,
      message: text,
    });

    if (!error) setText("");
    loadMessages(otherUser?.email);
    loadChatList();
  }

  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;

          loadChatList();

          if (
            otherUser &&
            ((msg.sender === userProfile.email &&
              msg.receiver === otherUser?.email) ||
              (msg.sender === otherUser?.email &&
                msg.receiver === userProfile.email))
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        },
      )
      .subscribe();

    loadMessages(otherUser?.email);
    return () => {
      supabase.removeChannel(channel);
    };
  }, [otherUser]);
  return (
    <div className={`chatWindow ${activeView === "list" ? "hidden" : ""}`}>
      <div className="chatHeader">
        <button onClick={goBack}>←</button>
        <img src={otherUser?.avatarUrl || userIcon} alt="" />
        <p>{otherUser?.name + " " + otherUser?.secondName}</p>
      </div>

      <div className="chatMessages">
        {messages.map((msg) => {
          const isMe = msg.sender === userProfile.email;
          const date = new Date(msg.created_at);
          return (
            <div
              key={msg.id}
              className={isMe ? "message myMessage" : "message"}
            >
              {msg.message}
              <p className="messageTime">
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
          );
        })}
      </div>

      {otherUser?.email !== "" ? (
        <div className="chatInput">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      ) : null}
    </div>
  );
}
