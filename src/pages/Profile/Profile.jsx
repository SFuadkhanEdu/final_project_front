import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"; // Ensure you create this file for styling
import DEFAULT_PROFILE_PIC from "../../assets/prof_pic.jpg";
import { useNavigate, useParams } from "react-router-dom";
import useGetRoleOfUser from "../../hooks/useGetRoleOfUser";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { role, setRole, loadingRole } = useGetRoleOfUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingRole) {
      if (!role) {
        navigate("/");
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
          // Fetch authenticated user
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

        setUser(userResponse.data); // ✅ Set user first, so we don't show "User not found"

        // Try fetching user posts
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
          setPosts([]); // Set empty posts array instead of throwing an error
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

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div id="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={user.profile_picture || DEFAULT_PROFILE_PIC}
          alt="Profile"
          className="profile-pic"
        />
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
              <video src={post.video_url} alt="Post" />
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
