import axios from 'axios';
import React, { useState } from 'react';
import {URL_LINK} from "../main.jsx"
import { useNavigate } from 'react-router-dom';
export const SignUp = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;  // Extract name and value from the input
    setUserInfo((prev) => ({
      ...prev,
      [name]: value  // Dynamically set the field based on the name
    }));
  };

  function handleSubmit(e){
    e.preventDefault()
    // console.log(URL_LINK)
    axios.post(URL_LINK+"signup",userInfo)
    .then((res)=>{
      navigate("/login")
    })
    .catch((err)=>console.log(err))
  }

  return (
    <div>
      <h1 className='text-center'>Sign Up</h1>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">UserName: </label>
          <input 
            type="text" 
            name="userName"  // Set the name attribute for dynamic handling
            className='border m-4' 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input 
            type="email" 
            name="email"  // Set the name attribute for dynamic handling
            className='border m-4' 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input 
            type="password" 
            name="password"  // Set the name attribute for dynamic handling
            className='border m-4' 
            onChange={handleChange} 
          />
        </div>
        <div>
          <button type="submit" className='border bg-blue-600 text-white rounded-md w-fit p-2 px-4'>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
