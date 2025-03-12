import React, { useEffect, useState } from "react";
import "./index.css";
import { useFetchReelsContext } from "../../context/FetchReelsContext";
import ReelComponent from "../../components/ReelComponent/ReelComponent";
import useGetRoleOfUser from "../../hooks/useGetRoleOfUser";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function UserHome() {
  const { reels, loading, error, loadMoreReels } = useFetchReelsContext();
  const { role, setRole } = useGetRoleOfUser();
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/self`,
          {
            withCredentials: true,
          }
        );
        setUserInfo(response.data);
        console.log("userINFO: ", userInfo);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (!role) {
      navigate("/");
      return;
    }
    if (role === "admin") {
      navigate("/admin");
    }
  }, [role, setRole]);

  return (
    <main id="main_page_section">
      <div class="main_page_container">
        {reels.map((reel) => (
          <ReelComponent
            loggedUserInfo={userInfo}
            object={reel}
          ></ReelComponent>
        ))}
      </div>
    </main>
  );
}

export default UserHome;
