import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Clapperboard,
  MessageSquare,
  Bell,
  User,
  PlusSquare,
  MoreHorizontal,
  LogOut
} from "lucide-react";
import "../../index.css";
import "./index.css";
import axios from "axios";

function Navbar() {
  const logOutHandle = async()=>{
    try {
      // Send a POST request to logout
      await axios.post("http://localhost:5001/api/logout", {}, { withCredentials: true });      
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  return (
    <nav id="user_navbar">
      <NavLink to="/">
        <h1>Fusion Space</h1>
      </NavLink>
      <ul className="navigation_links">
        <li>
          <NavLink to="/">
            <Home size={20} /> <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/search">
            <Search size={20} /> <span>Search</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reels">
            <Clapperboard size={20} /> <span>Reels</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/messages">
            <MessageSquare size={20} /> <span>Messages</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/notifications">
            <Bell size={20} /> <span>Notifications</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile/self">
            <User size={20} /> <span>Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/addReels">
            <PlusSquare size={20} /> <span>Create</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" onClick={logOutHandle}>
            <LogOut size={20} /> <span>LogOut</span>
          </NavLink>
        </li>
      </ul>
      <button>
        <MoreHorizontal size={20} />
      </button>
    </nav>
  );
}

export default Navbar;
