import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { Helmet } from "react-helmet"

import Login from './pages/Login';
import Home from './pages/Home'
import Signup from './pages/Signup';
import Subject from './pages/Subject';
import Completed from './pages/Completed';
import Notifications from './pages/Notifications';
import SearchArea from './pages/SearchArea';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/subject" element={<Subject />}></Route>
          <Route path="/completed" element={<Completed />}></Route>
          <Route path="/notification" element={<Notifications />}></Route>
          <Route path="/search" element={<SearchArea />}></Route>
        </Routes>
      </BrowserRouter>

    </div >
  );
}

export default App;
