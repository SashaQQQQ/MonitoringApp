export default function ChatList({ chats, activeChat, onSelect }) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>Chats</div>

      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelect(chat)}
          style={{
            ...styles.chatItem,
            background: activeChat?.id === chat.id ? "#1e293b" : "transparent",
          }}
        >
          <div style={styles.avatar}>💬</div>
          <div>
            <div style={styles.title}> {chat.reciever}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  sidebar: {
    width: 320,
    borderRight: "1px solid #1e293b",
    background: "#020617",
    overflowY: "auto",
  },
  header: {
    padding: 16,
    fontWeight: "bold",
    borderBottom: "1px solid #1e293b",
  },
  chatItem: {
    display: "flex",
    gap: 12,
    padding: 12,
    cursor: "pointer",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: 500,
  },
  preview: {
    fontSize: 12,
    opacity: 0.6,
  },
};
