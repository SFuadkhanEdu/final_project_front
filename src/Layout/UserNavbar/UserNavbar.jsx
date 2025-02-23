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
} from "lucide-react";
import "../../index.css";
import "./index.css";

function Navbar() {
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
      </ul>
      <button>
        <MoreHorizontal size={20} />
      </button>
    </nav>
  );
}

export default Navbar;
