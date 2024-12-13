// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuEJtiCW1y7WfM_mSbfCkdIFY5Jq-ri4E",
  authDomain: "chat-app-1d94b.firebaseapp.com",
  projectId: "chat-app-1d94b",
  storageBucket: "chat-app-1d94b.firebasestorage.app",
  messagingSenderId: "869910034307",
  appId: "1:869910034307:web:c2507596e8015c774028b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const SignUp = async (username,email,password) =>{
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password)
        const user = res.user
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hay,there i am using Bhai Chat",
            lastSeen : Date.now()

        })

    
        await setDoc(doc(db, "chats", user.uid), {
            chatData: []
        });
    }catch (error){
        console.error(error)


    }
}


const Logon = async (email,password)=>{
try{
    const res = await signInWithEmailAndPassword(auth,email,password);

}catch(error){
    console.log(error)
}    

}

const SignOut = async () =>{
    try{
        await signOut(auth)
    }catch(er){
        console.log(er)
    }
} 
export {SignUp,Logon,SignOut,auth,db}