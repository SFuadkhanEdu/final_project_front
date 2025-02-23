import React from "react";
import { NavLink } from "react-router";
import "../../index.css";
import "./index.css";
function Navbar() {
  return (
    <nav id="user_navbar">
      <NavLink><h1>FusionSpace</h1></NavLink>
      <ul className="navigation_links">
        <li>
          <NavLink to={"/"}>
            {" "}
            <span>Home</span>{" "}
          </NavLink>
        </li>
        <li>
          <NavLink to={"/"}>
            {" "}
            <span>Search</span>{" "}
          </NavLink>
        </li>
        <li>
          <NavLink to={"/"}>
            {" "}
            <span>Reels</span>{" "}
          </NavLink>
        </li>
        <li>
          <NavLink to={"/messages"}>
            {" "}
            <span>Messages</span>{" "}
          </NavLink>
        </li>
        <li>
          <NavLink to={"/notifications"}>
            {" "}
            <span>Notifications</span>{" "}
          </NavLink>
        </li>
        <li>
          <NavLink to={"/profile/self"}>
            {" "}
            <span>Profile</span>{" "}
          </NavLink>
        </li>
        <li>
          <NavLink to={"/addReels"}>
            {" "}
            <span>Create</span>{" "}
          </NavLink>
        </li>
      </ul>
      <button>More</button>
    </nav>
  );
}

export default Navbar;
