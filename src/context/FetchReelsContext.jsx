import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const ReelsContext = createContext();

function FetchReelsContextProvider({ children }) {
  const [prevReels, setPrevReels] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // To keep track of which page you're on

  

  const fetchReels = async () => {
    try {
      setLoading(true);
  
      const response = await axios.get('http://localhost:5001/api/posts', {
        // params: { page, limit: 5 }, // Adjust your API to support pagination with page and limit
        withCredentials: true,  // Ensures cookies (including HttpOnly) are sent with the request
      });
  
      // Append the new reels to the existing ones
      setReels((prev) => [...prev, ...response.data]);
      // Store the ids of the previous reels
      setPrevReels((prev) => [...prev, ...response.data.map(reel => reel.id)]);
    } catch (err) {
      console.error("Error fetching reels:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReels();

    
  }, [page]); // Fetch reels whenever page changes

  // Function to load more reels (for pagination)
  const loadMoreReels = () => {
    setPage((prev) => prev + 1); // Increment the page number to fetch the next set of reels
  };

  return (
    <ReelsContext.Provider value={{ reels, loading, error, loadMoreReels }}>
      {children}
    </ReelsContext.Provider>
  );
}
export function  useFetchReelsContext () {
    return useContext(ReelsContext)
}
export default FetchReelsContextProvider;
