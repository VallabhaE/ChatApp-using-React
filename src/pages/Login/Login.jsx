import React, { useState } from "react";
import "./login.css";
import { SignUp,Logon } from "../../config/firebase";
import { toast } from "react-toastify";

export default function Login() {
    const [curState, setState] = useState("Log In");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function forwardPage(e) {
        e.preventDefault(); // Prevent default form submission
        if(curState!=="Log In"){
            SignUp(userName, email, password);
        }else{
            Logon(email,password)
        }
        
    }

    return (
        <div className="bg-hero-pattern h-screen flex justify-center">
            <div className="w-1/3 flex flex-col border h-fit mt-20">
                <div className="flex m-5">
                    <img src="/icon.jpg" alt="" className="h-10 ml-3 mr-3" />
                    <h1 className="font-bold text-2xl justify-center">{curState}</h1>
                </div>
                <form className="flex flex-col" onSubmit={forwardPage}>
                    {curState === "Sign Up" && (
                        <>
                            <h3 className="font-bold">Enter Username</h3>
                            <input
                                type="text"
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Username"
                                className="h-10 ml-4 rounded hover:border-black"
                                required
                            />
                        </>
                    )}
                    <h3 className="font-bold">Enter Email</h3>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="h-10 ml-4 rounded hover:border-black"
                        required
                    />
                    <h3 className="font-bold">Enter Password</h3>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="h-10 ml-4 rounded hover:border-black"
                        required
                    />
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="border w-fit rounded bg-black text-white hover:text-black hover:bg-white p-1"
                        >
                            {curState}
                        </button>
                    </div>
                    <div className="login flex gap-3">
                        <input type="checkbox" id="terms" />
                        <label htmlFor="terms">Confirm Terms and Conditions</label>
                    </div>
                    <div className="loginToggle">
                        <p>
                            {curState === "Sign Up" ? "Already have an account?" : "Create an account"}{" "}
                            <span
                                onClick={() =>
                                    setState((prev) =>
                                        prev === "Sign Up" ? "Log In" : "Sign Up"
                                    )
                                }
                                className="cursor-pointer"
                            >
                                Click here
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
