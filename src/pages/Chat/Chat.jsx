import React from "react"
import "./Chat.css"
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar"
import RightSideBar from "../../components/RightSideBar/RightSideBar"
import ChatBox from "../../components/ChatBox/ChatBox"
export default function Chat(){
    return (
        <div className="chat">
            <div className="w-[96%] h-[75vh] border bg-white grid grid-cols-[1fr_2fr]">
                <LeftSideBar />
                <ChatBox />
                {/* <RightSideBar /> */}
            </div>
           
        </div>
    )
}