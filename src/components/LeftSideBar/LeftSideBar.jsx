import React, { useContext, useState } from "react";
import menu from "./../../assets/menu.svg";
import search from "./../../assets/search.png";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";

export default function LeftSideBar() {
  const [tempUser, setTempUser] = useState(null); // Holds a single user object
  const [user, setUser] = useState(null); // User to start a chat with
  const [showSearch, setShowSearch] = useState(false); // Toggles search input  
  const { userData, chatData ,chatUser,setChatUser,setMessageId,messageId} = useContext(AppContext);
  console.log(chatData);
    const setChat = async (item) =>{
        console.log(item)
        setMessageId(item.messageId)
        setChatUser(item)
    }
  // Function to add chat when clicking on a user
  const addChat = async () => {
    if (!tempUser) {
      console.log("No user selected");
      return; // Exit early if tempUser is null
    }
  
    // Check if the user already exists in chatData
    const userExists = chatData?.some(chat => chat.userData.id === tempUser.id);
    if (userExists) {
      console.log("User already exists in chat list");
      return; // Exit if the user already exists
    }
  
    const msgRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
  
    try {
      const newMessageRef = doc(msgRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: tempUser.id,
          updatedAt: Date.now(),
          messageSeen: true,
          userData: tempUser,
        }),
      });
  
      console.log("Chat added successfully");
    } catch (e) {
      console.error(e);
    }
  };
  
  // Input handler for searching users
  const inputHandler = async (e) => {
    const input = e.target.value.toLowerCase().trim();
    if (!input) {
      setTempUser(null); // Clear search results if input is empty
      return;
    }

    const userRef = collection(db, "users");
    const q = query(userRef, where("username", "==", input));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      setTempUser(querySnap.docs[0].data()); // Set found user
    } else {
      setTempUser(null); // Clear if no user found
    }
  };

  return (
    <div className="ls">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/icon.jpg" className="h-10" alt="App Icon" />
            <p className="ml-2 font-bold">ChatApp</p>
          </div>
          <div className="menu">
            <img className="menu h-5" src={menu} alt="Menu" />
            <div className="submenu">
              <p>Edit Profile</p>
              <hr />
              <p>Log Out</p>
            </div>
          </div>
        </div>
        <div className="flex items-center border rounded-md mt-4 p-2 hover:shadow-sm">
          <img className="h-4 mr-2" src={search} alt="Search Icon" />
          <input
            onChange={inputHandler}
            placeholder="Search by username"
            className="outline-none w-full"
            type="text"
          />
        </div>
      </div>

      {/* Display User Information */}
      <div className="mt-5">
        {tempUser ? (
          <div
            onClick={addChat}
            key={tempUser.id}
            className="group flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <img
              className="h-10 w-10 rounded-full"
              src={tempUser.avatar || "/default-avatar.jpg"} // Fallback avatar
              alt={`${tempUser.name} Icon`}
            />
            <div className="ml-3">
              <p className="font-semibold">{tempUser.name || "Unknown User"}</p>
              <span className="text-sm text-gray-500">Last Seen: {new Date(tempUser.lastSeen).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          chatData?.map((user) => (
            <div
            onClick={()=>setChat(user)}
              key={user.userData.id}
              className="group flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <img
                className="h-10 w-10 rounded-full"
                src={user.userData.avatar || "/default-avatar.jpg"} // Fallback avatar
                alt={`${user.userData.name} Icon`}
              />
              <div className="ml-3">
                <p className="font-semibold">{user.userData.name}</p>
                <span className="text-sm text-gray-500">{user.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
