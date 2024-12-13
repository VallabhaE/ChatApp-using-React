import { useContext, useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from "./pages/Login/Login"
import Chat from "./pages/Chat/Chat"
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'
function App() {
  const navigate = useNavigate()
  const {LoadData} = useContext(AppContext);
  useEffect(()=>{
    onAuthStateChanged(auth,async (user)=>{
      if(user){
        navigate('/chat')
        await LoadData(user.uid)
        
      }else{
        navigate('/')
      }
    })
  },[])

  return (
    <>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/chat' element={<Chat />} />
      <Route path='/profile' element={<ProfileUpdate />} />

    </Routes>
    </>
  )
}

export default App
