import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import useCalculateReelTimeInterval from "../../hooks/useCalculateReelTimeInterval";
import axios from "axios";
import DEFAULT_PROF_PIC from "../../assets/prof_pic.jpg";
import Reel from "../VideoPost/VideoComponent";
import { useModaLReelContext } from "../../context/ModalReelContext";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ReelComponent({ object ,loggedUserInfo}) {
  const { _id, video_url, description, created_at } = object;
  const post_user_id = object.user_id;
  const [postCreatorUserInfo, setPostCreatorUserInfo] = useState({});
  const [timeInterval] = useCalculateReelTimeInterval(created_at);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isModalVisible, handleModalVisibility } = useModaLReelContext();
  const [usernames, setUsernames] = useState({}); // Store usernames
  const navigate = useNavigate();
  const userInfo = loggedUserInfo;
  // 🆕 Like state
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // 🆕 Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 🆕 State for comment section visibility
  const [commentsVisible, setCommentsVisible] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchpostCreatorUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/${post_user_id}`,
          {
            withCredentials: true,
          }
        );
        setPostCreatorUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    if (post_user_id) {
      fetchpostCreatorUserInfo();
    }
  }, [post_user_id]);

  // Fetch likes info
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/likes/post/${_id}`,
          {
            withCredentials: true,
          }
        );

        const arr_of_likes = response.data;
        console.log("arr: ", arr_of_likes);
        console.log("post_user_id: ", post_user_id);
        console.log("find: ",arr_of_likes.find((like) => like.user_id === userInfo._id));
        console.log("userInfo: ", userInfo);
        
        setLiked(
          Boolean(arr_of_likes.find((like) => like.user_id === userInfo._id))
        );
        setLikesCount(response.data.length);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    if (_id) {
      fetchLikes();
    }
  }, [_id]);

  // Fetch comments info
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/comments/${_id}`,
          {
            withCredentials: true,
          }
        );
        console.log("comments: ",response.data);
        // Fetch usernames for comments
        const userIds = [...new Set(response.data.map((c) => c.user_id))];
        const userMap = {};

        await Promise.all(
          userIds.map(async (id) => {
            try {
              const res = await axios.get(
                `http://localhost:5001/api/users/${id}`,
                { withCredentials: true }
              );
              userMap[id] = res.data.username;
            } catch (error) {
              console.error(`Error fetching username for user ${id}:`, error);
              userMap[id] = "Unknown"; // Default value
            }
          })
        );

        setUsernames(userMap);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (_id) {
      fetchComments();
    }
  }, [_id]);

  // Handle like/unlike
  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/likes`,
        { post_id: _id },
        { withCredentials: true }
      );

      if (response.data.success) {
        // setLiked(response.data.liked);
        setLiked(!liked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  // Handle new comment submission
  const handleNewComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5001/api/comments`,
        { post_id: _id, comment: newComment },
        { withCredentials: true }
      );

      setComments([response.data, ...comments]); // Prepend new comment
      setNewComment(""); // Clear the comment input
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  const getUserName = async (post_user_id) =>{
    try {
      const response = await axios.get(
        `http://localhost:5001/api/users/${post_user_id}`,
        { withCredentials: true }
      );
      console.log(response.data.username);
      
      return response.data.username
    } catch (error) {
      console.error("Error fetching username", error);
    }
  }
  const viewProfileHandle = ()=>{
    navigate("/profile/self")
  }
  // Handle video play/pause based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);


  return (
    <>
      {isModalVisible ? (
        <Reel
          videoSrc={video_url}
          username={postCreatorUserInfo.username}
          toggleLike={toggleLike}
          likes={likesCount}
          isLiked={liked}
          description={description}
        />
      ) : (
        <div className="reel">
          <div className="reel_header">
            <div className="left">
              <div className="profile_pic">
                <img
                  src={postCreatorUserInfo.profile_picture ?? DEFAULT_PROF_PIC}
                  alt="Profile"
                  onClick={viewProfileHandle}
                />
              </div>
              <div className="profile_info">
                <h3>{postCreatorUserInfo.username || "Loading..."}</h3>
              </div>
              <div className="post_time">
                <p>{timeInterval}</p>
              </div>
            </div>
            <div className="right">more</div>
          </div>

          <div className="reel_video">
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              className="video"
              onClick={(e) => {
                handleModalVisibility();
                e.target.pause();
              }}
            >
              <source src={video_url} type="video/mp4" />
            </video>
          </div>

          <div className="reel_text_box">
            <div className="reel_actions_div">
              <div className="left">
                <button onClick={toggleLike}>
                  <Heart
                    className={`w-7 h-7 cursor-pointer transition-all ${
                      liked ? "text-red-500" : "text-white"
                    }`}
                    strokeWidth={liked ? 0 : 2}
                    fill={liked ? "white" : "none"}
                  />
                </button>
                <button onClick={() => setCommentsVisible(!commentsVisible)}>
                  <MessageCircle className="w-6 h-6 stroke-white" />
                </button>
                <button>
                  <Share2 className="w-6 h-6 stroke-white" />
                </button>
              </div>
              <div className="right">
                <button>
                  <Bookmark className="w-6 h-6 stroke-white" />
                </button>
              </div>
            </div>
            <div className="likes_div">
              <span className="likes_number">{likesCount}</span> likes
            </div>
            <div className="description_div">
              <p>{description}</p>
            </div>
          </div>

          {/* Comments Section - Visible only if commentsVisible is true */}
          {commentsVisible && (
            <div className="comments_section">
              <div className="comments_list">
              {comments.map((comment) => (
              <div key={comment._id} className="comment_item">
                <span className="comment_user">
                  {`${usernames[comment.user_id] || "Loading..."} :`}
                </span>
                <span className="comment_text">{comment.comment}</span>
              </div>
            ))}
              </div>

              <form className="comment_form" onSubmit={handleNewComment}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button type="submit">Post</button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ReelComponent;
