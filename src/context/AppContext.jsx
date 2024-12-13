import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppProvider = (props) => {
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const nav = useNavigate();
    const [messageId,setMessageId] = useState();
    const [messages,setMessages] = useState();
    const [chatUser,setChatUser] = useState();

    const LoadData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);
            if (userData.name !== "") {
                nav("/chat");
            } else {
                nav("/profile");
            }

            await updateDoc(userRef, {
                lastSeen: Date.now(),
            });

            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now(),
                    });
                }
            }, 60000);
        } catch (er) {
            console.error(er);
        }
    };
    
      
    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, "chats", userData.id);

            // Setting up real-time listener for chat data
            const unSub = onSnapshot(chatRef, (res) => {
                // Safely access chatsData and provide an empty array if it's null or undefined
                const chatItems = res.data()?.chatsData || [];

                // Directly set the chatData without needing to resolve user data
                setChatData(chatItems.sort((a, b) => b.updateAt - a.updateAt));
            });

            // Cleanup function to unsubscribe when userData changes or unmounts
            return () => {
                unSub();
            };
        }
    }, [userData]);  // Re-run the effect whenever userData changes

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        LoadData,
        messages,setMessages,
        messageId,setMessageId,
        chatUser,setChatUser
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppProvider;
