import React from 'react'
import AdminNavbar from '../Layout/AdminNavbar/AdminNavbar'
import { Outlet } from 'react-router'

function AdminLayout({children}) {
  return (
    <>
    <AdminNavbar></AdminNavbar>
    <Outlet></Outlet>
    </>
  )
}

export default AdminLayout