import axios from 'axios';
import React, { useState } from 'react';
import { URL_LINK } from "../main.jsx";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from '../Redux/userSlice.js';

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    console.log("Me",useSelector(s=>s.user))

    // State for storing user login information
    const [userInfo, setUserInfo] = useState({
        userName: "",
        password: ""
    });

    // Function to handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure name and value from the input
        setUserInfo((prev) => ({
            ...prev,
            [name]: value // Dynamically update the state based on the input field's name
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await axios.post(`${URL_LINK}login`, userInfo, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Include cookies for authentication
            });

            console.log("Login response:", response.data); // Log the response for debugging

            // Dispatch action to store authenticated user details in Redux store
            dispatch(setAuthUser(response.data));

            // Navigate to another route after successful login (e.g., dashboard)
            navigate('/');
        } catch (error) {
            console.error("Login error:", error); // Log error for debugging
        }
    };

    return (
        <div>
            <h1 className='text-center'>Login</h1>
            <form className='flex flex-col' onSubmit={handleSubmit}>
                <div className="m-4">
                    <label htmlFor="userName">UserName: </label>
                    <input
                        type="text"
                        name="userName"
                        className='border p-2 w-full'
                        onChange={handleChange}
                        value={userInfo.userName} // Bind value to state
                        required
                    />
                </div>
                <div className="m-4">
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        name="password"
                        className='border p-2 w-full'
                        onChange={handleChange}
                        value={userInfo.password} // Bind value to state
                        required
                    />
                </div>
                <div className="m-4 text-center">
                    <button
                        type="submit"
                        className='border bg-blue-600 text-white rounded-md px-4 py-2'
                    >
                        Submit
                    </button>
                    <a href='/signup'>Create Account?</a>
                </div>
            </form>
        </div>
    );
};
