import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"; // Ensure you create this file for styling
import DEFAULT_PROFILE_PIC from "../../assets/prof_pic.jpg";
import { useNavigate, useParams } from "react-router-dom";
import useGetRoleOfUser from "../../hooks/useGetRoleOfUser";
import { useModaLReelContext } from "../../context/ModalReelContext";
import Reel from "../../components/VideoPost/VideoComponent";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { role, setRole, loadingRole } = useGetRoleOfUser();
  const navigate = useNavigate();
  const { isModalVisible, handleModalVisibility } = useModaLReelContext();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!loadingRole) {
      if (!role) {
        navigate("/login");
        return;
      }
      if (role === "admin") {
        navigate("/admin");
      }
    }
  }, [role, setRole, loadingRole, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let userResponse;

        if (id === "self") {
          userResponse = await axios.get("http://localhost:5001/api/users/self", {
            withCredentials: true,
          });
        } else {
          userResponse = await axios.get(`http://localhost:5001/api/users/${id}`, {
            withCredentials: true,
          });
        }

        if (!userResponse.data) {
          throw new Error("User not found");
        }

        setUser(userResponse.data);

        try {
          const postsResponse = await axios.get(
            `http://localhost:5001/api/posts/user/${userResponse.data._id}`,
            {
              withCredentials: true,
            }
          );
          setPosts(postsResponse.data || []);
        } catch (postError) {
          console.warn("No posts found for this user.");
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_picture", file);
  
      try {
        const response = await axios.put(
          "http://localhost:5001/api/users/self",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data", // Ensuring content type is multipart
            },
          }
        );
        setUser((prevUser) => ({
          ...prevUser,
          profile_picture: response.data.profile_picture,
        }));
      } catch (error) {
        console.error("Error uploading profile picture", error);
      }
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  const clickHandle = (post) => {
    handleModalVisibility();
  };

  return (
    <div id="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-pic-container">
          <img
            src={user.profile_picture || DEFAULT_PROFILE_PIC}
            alt="Profile"
            className="profile-pic"
          />
          <label htmlFor="profile-pic-input" className="change-pic-btn">
            Change
          </label>
          <input
            type="file"
            id="profile-pic-input"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.bio || "No bio available."}</p>
          <div className="profile-stats">
            <span>
              <strong>{posts.length}</strong> Posts
            </span>
            <span>
              <strong>{user.followers?.length || 0}</strong> Followers
            </span>
            <span>
              <strong>{user.following?.length || 0}</strong> Following
            </span>
          </div>
          {id !== "self" && <button className="follow-btn">Follow</button>}
        </div>
      </div>

      {/* User Posts */}
      <div className="profile-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post">
              <video
                src={post.video_url}
                alt="Post"
                onClick={() => clickHandle(post)}
              />
              {isModalVisible ? (
                <Reel
                  videoSrc={post?.video_url}
                  likes={post?.likes || 0}
                  username={post?.username}
                  description={post?.description}
                />
              ) : null}
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
