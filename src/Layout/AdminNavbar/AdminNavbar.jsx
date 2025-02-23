import React from 'react'
import { NavLink } from 'react-router'

function AdminNavbar() {
  return (
    <nav>
    <ul>
      <li>
        <NavLink to={"/admin"}>Home</NavLink>
      </li>
      <li>
        <NavLink to={"/admin/messages"}>Messages</NavLink>
      </li>
      <li>
        <NavLink to={"/admin/profile"}>Profile</NavLink>
      </li>
    </ul>
  </nav>
  )
}

export default AdminNavbar