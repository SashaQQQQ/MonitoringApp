import { useState, useEffect } from "react";
import { supabase } from "./SupabaseClient";
import "../Styles/Chat.css";
function Chat({ userProfile }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatList, setChatList] = useState([]);
  const [otherUser, setOtherUser] = useState(null);

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
    loadChatList();

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [otherUser]);

  useEffect(() => {
    loadMessages(otherUser);
  }, [otherUser]);

  return (
    <div className="chatContainer">
      <div className="chat-list">
        <h3>Chats</h3>

        {chatList.length === 0 && <p>No chats</p>}

        {chatList.map((chat) => (
          <div
            key={chat.login}
            className={`chat-user ${otherUser === chat.login ? "active" : ""}`}
            onClick={() => setOtherUser(chat.login)}
          >
            <div className="chat-user-name">{chat.login}</div>
            <div className="chat-user-last">{chat.lastMessage}</div>
          </div>
        ))}
      </div>

      <div className="chat">
        {otherUser ? (
          <>
            <div className="chat-header">{otherUser}</div>

            <div className="messages">
              {messages.map((m) => {
                if (!m.message || m.message.trim() === "") return null;

                return (
                  <p
                    key={m.id}
                    className={
                      m.sender === userProfile[0].login ? "me" : "other"
                    }
                  >
                    {m.message}
                  </p>
                );
              })}
            </div>

            <div className="send-box">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="empty-chat">Select a chat</div>
        )}
      </div>
    </div>
  );
}

export default Chat;
