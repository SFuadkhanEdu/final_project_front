import React, { createContext, useState, useEffect, useContext } from 'react';

export const UploadReelContext = createContext();

function UploadReelContextProvider({ children }) {
    const [reelVideo,setReelVideo] = useState()
    const [reelDescription,setReelDescription] = useState();
    

  return (
    <UploadReelContext.Provider value={{ reelVideo,setReelVideo,reelDescription,setReelDescription }}>
      {children}
    </UploadReelContext.Provider>
  );
}
export function  useUploadReelsContext () {
    return useContext(UploadReelContext)
}
export default UploadReelContextProvider;
