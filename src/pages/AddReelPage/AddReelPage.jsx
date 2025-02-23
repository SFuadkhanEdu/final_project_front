import React, { useEffect, useState } from 'react';
import { useUploadReelsContext } from '../../context/UploadReelContext';
import axios from 'axios';
import VideoUploadComponent from '../../components/VideoUploadComponent/VideoUploadComponent';
import { toast, ToastContainer } from 'react-toastify';

function AddReelPage() {
  const { reelVideo, setReelVideo, reelDescription, setReelDescription } = useUploadReelsContext();
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getHashtags() {
      const response = await axios.get("http://localhost:5001/api/hashtags", {
        withCredentials: true
      });
      // Assuming response.data is an array of objects with 'name' property for hashtags
      const hashtagData = response.data.map(item => item.name); // Adjust based on your API response
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
    // formData.append("user_id", "65f8c43b7c9c1b002f14e7d3"); // Example User ID
    formData.append("category_id", "65f8c43b7c9c1b002f14e7d9"); // Example Category ID

    const formDataHashtags = new FormData();

    try {
      const postResponse = await axios.post("http://localhost:5001/api/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      selectedHashtags.forEach(
        (x,i)=>formData.append(i,x)
      )
      const hashResponse = await axios.post("http://localhost:5001/api/hashtags", formDataHashtags, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Post uploaded successfully!");

    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed! ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter hashtags based on the search query
  const filteredHashtags = hashtags.filter((hashtag) =>
    hashtag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHashtagClick = (hashtag) => {
    setSelectedHashtags((prevSelected) => [...prevSelected, hashtag]);
  };

  return (
    <>
        <ToastContainer></ToastContainer>

      {!reelVideo ? (
        <VideoUploadComponent />
      ) : (
        <div>
          <textarea
            placeholder="Description"
            value={reelDescription}
            onChange={(e) => setReelDescription(e.target.value)}
          />

          {/* Hashtag Search */}
          <div>
            <input
              type="text"
              placeholder="Search Hashtags"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div>
              {filteredHashtags.map((hashtag, index) => (
                <button key={index} onClick={() => handleHashtagClick(hashtag)}>
                  #{hashtag}
                </button>
              ))}
            </div>
          </div>

          {/* Display selected hashtags */}
          <div>
            <p>Selected Hashtags: {selectedHashtags.join(' ')}</p>
          </div>

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload Post"}
          </button>
        </div>
      )}
    </>
  );
}

export default AddReelPage;
