import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp } from './Components/SignUp.jsx';
import {Login} from './Components/Login.jsx';
export const URL_LINK = "http://localhost:3000/"
import { Provider } from "react-redux";
import store from './Redux/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />

      </Routes>
    </BrowserRouter>
  </Provider>
);
