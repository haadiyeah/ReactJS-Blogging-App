
import './assets/styles/blogfeed.css';  //import css file
import './assets/styles/global.css';
import Home from './pages/Home';
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import Feed from './components/Feed'

import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from "react-router-dom"

function Nav() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )

}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Nav />}>
                <Route index element={<Home />} /> 
                <Route path="blogs" element={<Home />} />  {/* for localhost:3000/blogs*/}
                
                <Route path="users" >
                    <Route path="register" element={<Register />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="feed" element={<Feed />} />
                </Route> 

                
                {/* <Route path=":id" element={<Book />} />
                <Route path="new" element={<NewBook />} /> */}
            </Route>
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    )
}

export default App;