import React, { useContext, useEffect, useState } from "react";
import greenDot from "./../../assets/green.jpg";
import menu from "./../../assets/menu.svg";
import img from "./../../assets/image.png";
import send from "./../../assets/send.svg";
import { AppContext } from "../../context/AppContext";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function ChatBox() {
    const {
        messages = [], // Ensure messages is initialized as an empty array
        setMessages,
        messageId,
        setMessageId,
        chatUser,
        setChatUser,
        userData,
    } = useContext(AppContext);

    const [input, setInput] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Fetch messages when messageId changes
    useEffect(() => {
        if (messageId) {
            setLoadingMessages(true);
            const unSub = onSnapshot(
                doc(db, "messages", messageId),
                (res) => {
                    const fetchedMessages = res.data()?.messages || [];
                    setMessages(fetchedMessages);
                    setLoadingMessages(false);
                },
                (error) => {
                    console.error("Error fetching messages:", error);
                    setLoadingMessages(false);
                }
            );
            return () => {
                unSub();
            };
        }
    }, [messageId, setMessages]);

    // Function to send a message
    const sendMessage = async () => {
        try {
            if (input && messageId) {
                // 1. Update the messages in the 'messages' collection
                await updateDoc(doc(db, "messages", messageId), {
                    messages: arrayUnion({
                        sId: userData.id,    // Sender ID
                        rId: chatUser.rId,   // Receiver ID
                        text: input,
                        createdAt: new Date(),
                    }),
                });
    
                // 2. Prepare the list of user IDs for both sender and receiver
                const userIds = [chatUser.rId, userData.id]; // Receiver's ID and Sender's ID
    
                for (const id of userIds) {
                    const userChatsRef = doc(db, "chats", id);
                    const userChatsnap = await getDoc(userChatsRef);
    
                    if (userChatsnap.exists()) {
                        const userChatData = userChatsnap.data();
                        const chatIdx = userChatData.chatsData.findIndex(
                            (c) => c.messageId === messageId
                        );
    
                        if (chatIdx !== -1) {
                            // Update the last message and other properties
                            userChatData.chatsData[chatIdx].lastMessage = input.slice(0, 30);
                            userChatData.chatsData[chatIdx].updatedAt = Date.now();
                            if (userChatData.chatsData[chatIdx].rId === userData.id) {
                                userChatData.chatsData[chatIdx].messageSeen = false; // For the receiver
                            }
    
                            // Update the sender's chat
                            await updateDoc(userChatsRef, {
                                chatsData: userChatData.chatsData,
                            });
                        }
                    } else {
                        // 3. If no chat exists for this user, create one
                        await setDoc(userChatsRef, {
                            chatsData: [
                                {
                                    messageId: messageId,
                                    lastMessage: input.slice(0, 30),
                                    rId: chatUser.rId,    // Store receiver's ID
                                    updatedAt: Date.now(),
                                    messageSeen: false, // Assuming the receiver hasn't seen the message yet
                                    userData: chatUser,  // Store the receiver's data
                                },
                            ],
                        });
                    }
                }
    
                // Clear the input field after sending the message
                setInput("");
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    
    return chatUser ? (
        <div className="h-full flex flex-col">
            {/* Top Bar */}
            <div className="flex justify-between items-center m-2">
                {/* Left Section: User Info */}
                <div className="flex items-center">
                    <img
                        src={chatUser.userData.avatar || "/icon.jpg"}
                        className="h-10 w-10 rounded-full"
                        alt="User Avatar"
                    />
                    <p className="ml-3 flex items-center font-semibold">
                        {chatUser.userData.name}
                        <img src={greenDot} alt="Online Status" className="h-4 w-4 ml-2" />
                    </p>
                </div>

                {/* Right Section: Menu Icon */}
                <div>
                    <img src={menu} className="h-8 w-8 cursor-pointer" alt="Menu Icon" />
                </div>
            </div>

            {/* Chat Messages Section */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100 space-y-3">
                {loadingMessages ? (
                    <p className="text-center text-gray-500">Loading messages...</p>
                ) : messages && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.sId === userData.id ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`${
                                    msg.sId === userData.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-black"
                                } p-3 rounded-lg max-w-xs`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet.</p>
                )}
            </div>

            {/* Chat Input Section */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                    {/* Input Field */}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    {/* Image Upload */}
                    <input type="file" id="imageInput" accept="image/png" hidden />
                    <label htmlFor="imageInput" className="cursor-pointer">
                        <img src={img} className="h-6 w-6" alt="Upload Icon" />
                    </label>

                    {/* Send Button */}
                    <button
                        onClick={sendMessage}
                        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                    >
                        <img src={send} className="h-5 w-5" alt="Send Icon" />
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
            Select a chat to start messaging.
        </div>
    );
}
