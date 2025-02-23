import React, { useEffect, useState, useCallback } from 'react';
import { useUploadReelsContext } from '../../context/UploadReelContext';
import axios from 'axios';
import VideoUploadComponent from '../../components/VideoUploadComponent/VideoUploadComponent';
import { toast, ToastContainer } from 'react-toastify';
import './index.css'; // Import the CSS

// Memoized HashtagList to avoid re-rendering on every update
const HashtagList = React.memo(({ hashtags, onHashtagClick }) => (
  <div className="hashtag-list">
    {hashtags.map((hashtag, index) => (
      <button key={index} onClick={() => onHashtagClick(hashtag)}>
        #{hashtag}
      </button>
    ))}
  </div>
));

function AddReelPage() {
  const { reelVideo, setReelVideo, reelDescription, setReelDescription } = useUploadReelsContext();
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]); // Use state for selected hashtags
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getHashtags() {
      const response = await axios.get("http://localhost:5001/api/hashtags", {
        withCredentials: true
      });
      const hashtagData = response.data.map(item => item.name); 
      setHashtags(hashtagData);
    }
    getHashtags();
  }, []);

  const handleUpload = async () => {
    if (!reelDescription || !reelVideo) {
      alert("Please fill all fields and select a video.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("description", reelDescription);
    formData.append("video", reelVideo);
    formData.append("category_id", "65f8c43b7c9c1b002f14e7d9"); 

    selectedHashtags.forEach(hashtag => {
      formData.append("hashtags[]", hashtag); 
    });

    try {
      const postResponse = await axios.post("http://localhost:5001/api/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Post uploaded successfully!");
      setSelectedHashtags([]); // Clear selected hashtags after upload
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed! ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredHashtags = hashtags.filter((hashtag) =>
    hashtag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // useCallback to optimize the function
  const handleHashtagClick = useCallback((hashtag) => {
    // Avoid adding duplicate hashtags
    if (!selectedHashtags.includes(hashtag)) {
      setSelectedHashtags((prevSelected) => [...prevSelected, hashtag]);
    }
  }, [selectedHashtags]);

  // Memoized Component to only show selected hashtags without triggering unnecessary re-renders
  const SelectedHashtags = React.memo(() => (
    <div className="selected-hashtags">
      <p>Selected Hashtags: {`#${selectedHashtags.join(' #')}`}</p>
    </div>
  ));

  return (
    <>
      <ToastContainer />

      <div className="add-reel-page-wrapper">
        <div className="add-reel-container">
          {!reelVideo ? (
            <VideoUploadComponent />
          ) : (
            <div className="flex">
              <div className="upload_video_div"> 
                <video src={URL.createObjectURL(reelVideo)} controls width="500" autoPlay muted/>
              </div>
              <div className="form-container">
                <textarea
                  placeholder="Description"
                  value={reelDescription}
                  onChange={(e) => setReelDescription(e.target.value)}
                  maxLength={500}
                />

                <div className="hashtag-search">
                  <input
                    type="text"
                    placeholder="Search Hashtags"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <HashtagList hashtags={filteredHashtags} onHashtagClick={handleHashtagClick} />
                </div>

                {/* Memoized and separate component for displaying selected hashtags */}
                <SelectedHashtags />

                <button onClick={handleUpload} disabled={loading}>
                  {loading ? "Uploading..." : "Upload Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddReelPage;
