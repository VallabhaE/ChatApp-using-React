import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL_LINK } from "./main";
import "./App.css";

function App() {
  const { authUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // States
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  // Initialize socket connection
  const socket = useMemo(() => {
    if (!authUser) return null;
    return io("http://localhost:3000/", { query: { userId: authUser.id } });
  }, [authUser]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    const handlePersonalMessage = (messages) => {
      console.log(messages);
      console.log(selectedUser);
      const updated = messages.filter((msg) => (msg.senderId === selectedUser.id) || (msg.receiverId === selectedUser.id));
      console.log(updated);
      setChat(updated);
    };

    const handleUsersUpdate = (updatedUsers) => {
      const filteredUsers = updatedUsers.filter((user) => user.id !== authUser.id);
      setUsers(filteredUsers);
    };

    socket.on("personal", handlePersonalMessage);
    socket.on("users", handleUsersUpdate);
    socket.on("connect", () => console.log("Connected with socket ID:", socket.id));

    // Cleanup listeners on unmount
    return () => {
      socket.off("personal", handlePersonalMessage);
      socket.off("users", handleUsersUpdate);
      socket.off("connect");
    };
  }, [socket, selectedUser]);

  // Fetch chat data for the selected user
  const selectUser = async (user) => {
    setSelectedUser(user);
    setChat([]); // Clear chat while loading new data

    try {
      const res = await axios.get(
        `${URL_LINK}getChatData/${authUser.id}/${user.id}` // Include senderId (authUser.id) and receiverId (user.id)
      );
      if (res.status === 200) {
        setChat(res.data.messages);
      } else {
        console.error("Failed to fetch chat data:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  // Send a new message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;

    socket.emit("message", {
      senderId: authUser.id,
      receiverId: selectedUser.id,
      message,
    });

    setChat((prev) => [...prev, { senderId: authUser.id, message }]);
    setMessage("");
  };

  // Track changes to selectedUser state
  useEffect(() => {
    if (selectedUser) {
      console.log("Selected User:", selectedUser); // Logs the updated selectedUser
    }
  }, [selectedUser]); // This will log the selectedUser whenever it changes

  return (
    <div className="chat-app">
      <Sidebar users={users} selectUser={selectUser} selectedUser={selectedUser} />
      <ChatContainer
        selectedUser={selectedUser}
        chat={chat}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
}

function Sidebar({ users, selectUser, selectedUser, authUserId }) {
  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {users
          .filter((user) => user.id !== authUserId) // Exclude the authenticated user
          .map((user) => (
            <li
              key={user.id}
              onClick={() => selectUser(user)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedUser?.id === user.id ? "#f0f0f0" : "transparent",
              }}
              className="m-4 border border-black rounded-xl"
            >
              {user.username}
            </li>
          ))}
      </ul>
    </div>
  );
}

function ChatContainer({ selectedUser, chat, message, setMessage, sendMessage }) {
  if (!selectedUser) return null;

  return (
    <div className="chat-container">
      <h2>Chat with {selectedUser.username}</h2>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.senderId === selectedUser.id ? "received" : "sent"}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
