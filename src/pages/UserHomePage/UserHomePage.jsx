import React, { useEffect } from "react";
import "./index.css"
import { useFetchReelsContext } from "../../context/FetchReelsContext";
import ReelComponent from "../../components/ReelComponent/ReelComponent";
import "./index.css"
import useGetRoleOfUser from "../../hooks/useGetRoleOfUser";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import Reel from "../../components/VideoPost/VideoComponent";
import { useModaLReelContext } from "../../context/ModalReelContext";
function UserHome() {
    const { reels, loading, error, loadMoreReels } = useFetchReelsContext();
    const {role,setRole} = useGetRoleOfUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!role) {
            navigate("/")
            return
        }
        if (role === "admin") {
            navigate("/admin")
        }   
    }, [role,setRole])
    
  return(
        <main id="main_page_section">
            <div class="main_page_container">
            {reels.map(
                reel=><ReelComponent object={reel}></ReelComponent>
            )}
            </div>
            
        </main>
  )

  
}

export default UserHome;
