import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle } from "lucide-react";
import "./index.css"; // Import styles
import { useModaLReelContext } from "../../context/ModalReelContext";

const Reel = ({ videoSrc, likes = 0, comments, username, hashtags, toggleLike,isLiked, description }) => {
  const videoRef = useRef(null);
  const modalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(isLiked);
  const { isModalVisible, handleModalVisibility } = useModaLReelContext();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleModalVisibility(false);
      }
    };

    if (isModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalVisible]);

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    videoRef.current.muted = !videoRef.current.muted;
  };

  const toggleLikeChild = () => {
    toggleLike()
    setLiked((prev) => !prev);
  };

  if (!isModalVisible) return null; // Hide the component when modal is not visible

  return (
    <div className="modal-overlay">
      <div className="reel-container" ref={modalRef}>
        <video
          ref={videoRef}
          src={videoSrc}
          className="reel-video"
          autoPlay
          loop
          muted={isMuted}
          onClick={togglePlayPause}
        />

        {/* Overlay UI */}
        <div className="reel-overlay">
          <h3 className="font-bold">{username}</h3>
          <p>{hashtags}</p>
          <p>{description}</p>
        </div>

        {/* Controls */}
        <div className="reel-controls">
          <button onClick={toggleLikeChild}>
            <Heart
              className={`w-7 h-7 cursor-pointer transition-all ${liked ? "text-red-500" : "text-white"}`}
              strokeWidth={liked ? 0 : 2}
              fill={liked ? "red" : "none"}
            />
            <span>{likes}</span>
          </button>
          <button>
            <MessageCircle className="w-7 h-7" />
            <span>{comments}</span>
          </button>
          <button onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reel;
