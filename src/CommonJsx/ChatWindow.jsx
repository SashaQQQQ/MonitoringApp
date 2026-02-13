import { useEffect, useState } from "react";
import { supabase } from "./SupabaseClient.js";

export default function ChatWindow({ chat, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!chat || !user) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender.eq.${user.login},receiver.eq.${chat.login}),
           and(sender.eq.${chat.login},receiver.eq.${user.login})`,
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setMessages(data || []);
    };

    load();
  }, [chat, user]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const { error } = await supabase.from("messages").insert({
      sender: user.login,
      receiver: chat.login,
      message: text,
    });

    if (error) {
      console.error(error);
      return;
    }

    setText("");
  }

  if (!chat) {
    return <div style={styles.empty}>Выберите чат</div>;
  }

  return (
    <div style={styles.window}>
      <div style={styles.header}>{chat.login}</div>

      <div style={styles.messages}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              ...styles.msg,
              alignSelf: m.sender === user.login ? "flex-end" : "flex-start",
              background: m.sender === user.login ? "#2563eb" : "#1e293b",
            }}
          >
            {m.message}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение..."
          style={styles.input}
        />
      </form>
    </div>
  );
}
const styles = {
  window: { flex: 1, display: "flex", flexDirection: "column" },
  header: { padding: 16, borderBottom: "1px solid #1e293b" },
  messages: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
  },
  msg: { padding: "8px 12px", borderRadius: 12, maxWidth: "65%" },
  inputBox: { padding: 12, borderTop: "1px solid #1e293b" },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    outline: "none",
  },
  empty: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
};
