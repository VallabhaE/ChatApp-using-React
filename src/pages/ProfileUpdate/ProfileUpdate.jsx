import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

export default function ProfileUpdate() {
    const [image,setImage] = useState();
    const [name,setName] = useState();
    const {setUserData} = useContext(AppContext);

    const [bio,setBio] = useState();
    const [uid,setUid] = useState("");
    const nav = useNavigate();
    async function profileUpdate(e){
        e.preventDefault();

        try{

            const docRef = doc(db,"users",uid)
            await updateDoc(docRef,{
                bio:bio,
                name:name
            })
            const snap = await getDoc(docRef);
            setUserData(snap.data());
            nav('/chat')

        }catch(er){

        }
    }
    useEffect(()=>{
        onAuthStateChanged(auth,async (user)=>{
            if(user){
                setUid(user.uid);
                const docRef = doc(db,"users",user.uid);
                const docSnap =  await getDoc(docRef);
                if(docSnap.data().name){
                    setName(docSnap.data().name)
                }
                if(docSnap.data().bio){
                    setBio(docSnap.data().bio)
                }
            }else{
                nav('/')
            }
        })
    },[])
    return (
        <div className="profile h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <form onSubmit={profileUpdate} className="flex flex-col items-center space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-700">Profile Details</h3>

                    {/* Avatar Upload */}
                    <label htmlFor="avatar" className="cursor-pointer text-center">
                        <input
                            type="file"
                            id="avatar"
                            accept=".png,.jpg,.jpeg"
                            onChange={(event)=>{
                                setImage(event.target.files[0])
                            }}
                            hidden
                        />
                        <img
                            src={image? URL.createObjectURL(image):"/icon.jpg"} alt="Avatar Placeholder"
                            className="h-20 w-20 rounded-full mb-2 border border-gray-300"
                        />
                        <p className="text-sm text-blue-500 hover:underline">
                            Upload Profile Image
                        </p>
                    </label>

                    {/* Name Input */}
                    <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        onChange={(e)=>setName(e.target.value)}
                        required
                    />

                    {/* Bio Textarea */}
                    <textarea
                        placeholder="Write profile bio"
                        onChange={(e)=>setBio(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    ></textarea>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}