import React from "react";
import Navbar from "../Layout/UserNavbar/UserNavbar";
import { Outlet } from "react-router";
import ContentFlexContainer from "../components/ContentFlexContainer/ContentFlexContainer";

function MainLayout({ children }) {
  return (
    <>
      <ContentFlexContainer>
        <Navbar />
        <Outlet />
      </ContentFlexContainer>
    </>
  );
}

export default MainLayout;
