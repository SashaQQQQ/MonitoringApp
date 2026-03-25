import { useEffect, useState, useContext } from "react";
import { supabase } from "./SupabaseClient.js";
import { DataContext } from "./DataContext.js";
import "../Styles/ChatWindow.css";

export default function ChatWindow({ loadChatList, otherUser }) {
  const { userProfile } = useContext(DataContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function loadMessages(partner) {
    if (!partner) return;

    const me = String(userProfile[0].login);
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

    const { error } = await supabase.from("messages").insert({
      sender: userProfile[0].login,
      receiver: otherUser,
      message: text,
    });

    if (!error) setText("");
    loadMessages(otherUser);
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
            ((msg.sender === userProfile[0].login &&
              msg.receiver === otherUser) ||
              (msg.sender === otherUser &&
                msg.receiver === userProfile[0].login))
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        },
      )
      .subscribe();

    loadMessages(otherUser);
    return () => {
      supabase.removeChannel(channel);
    };
  }, [otherUser]);
  return (
    <div className="chatWindow">
      <div className="chatWindow">
        <div className="chatHeader">
          <p>{otherUser || "Select chat"}</p>
        </div>

        <div className="chatMessages">
          {messages.map((msg) => {
            const isMe = msg.sender === userProfile[0].login;

            return (
              <div
                key={msg.id}
                className={isMe ? "message myMessage" : "message"}
              >
                {msg.message}
              </div>
            );
          })}
        </div>

        <div className="chatInput">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
