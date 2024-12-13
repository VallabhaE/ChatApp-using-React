import React, { useContext } from "react";
import { SignOut } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";

export default function RightSideBar(){
    // const {userData} = useContext(AppContext);
    
    return (
        <div>
            <div>
                <img src="/icon.jpg" alt="" />
                <hr />
                <h3 className="flex justify-center font-bold">Vallu Bhai</h3>
                <hr />
                <p>Hay,this is vallabha developing chat application to learn about how firebase works</p>
            </div>

            <button className="bg-blue-700 p-2 rounded-xl flex ml-32" onClick={SignOut}>Signout</button>
        </div>
    )
}