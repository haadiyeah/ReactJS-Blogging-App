
import './assets/styles/blogfeed.css';  //import css file
import './assets/styles/global.css';
import Home from './pages/Home';
import Register from './pages/Register'
import Blog from './pages/Blog';
import CreatePost from './pages/CreatePost';

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
                <Route path="blogs"  > 
                     <Route index element={<Home />} /> 
                     <Route path=":blogId" element={<Blog />} />
                </Route>  {/* for localhost:3000/blogs*/}
                
                <Route path="users" >
                    <Route path="register" element={<Register />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="feed" element={<Feed />} />
                </Route> 

                <Route path="create"  >
                   <Route index element={<CreatePost />} /> 
                    <Route path=":blogId" element={<CreatePost />} />
                </Route>

            </Route>
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    )
}

export default App;