import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './salju.css'
import './perumahan.css'
import { getPosts, getPost, createPost, updatePost, deletePost } from './api'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { About } from "../Pages/About";
import { Contact } from "../Pages/Contact";
import { CreateBlog } from "../Pages/CreateBlog";
import { Home } from "../Pages/Home";
import { Landing } from "../Pages/Landing";
import { Profile } from "../Pages/Profile";
import { ReadBlog } from "../Pages/ReadBlog";
import { Layout } from '../Component/Layout'
import { Navbar } from '../Component/Navbar'
import axios from 'axios'

function App() {
  useEffect(() => {
    const preventZoom = (e) => {
      if (e.scale !== 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("gesturestart", preventZoom);
    document.addEventListener("gesturechange", preventZoom);

    return () => {
      document.removeEventListener("gesturestart", preventZoom);
      document.removeEventListener("gesturechange", preventZoom);
    };
  }, []);

  useEffect(() => {
    const preventCtrlScrollZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
  
    document.addEventListener("wheel", preventCtrlScrollZoom, { passive: false });
  
    return () => {
      document.removeEventListener("wheel", preventCtrlScrollZoom);
    };
  }, []);
  useEffect(() => {
    let token = sessionStorage.getItem("User")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  
  }, []);
  
  //http://localhost:5173/Landing
  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<CreateBlog />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant" element={<Profile />} />
        <Route path="/readblog" element={<ReadBlog />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
