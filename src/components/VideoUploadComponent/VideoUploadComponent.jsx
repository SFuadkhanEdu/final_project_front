import React from 'react'
import { useUploadReelsContext } from '../../context/UploadReelContext';

function VideoUploadComponent() {
    const {setReelVideo} = useUploadReelsContext()
    const handleFileChange = (event) => {
        console.log(event.target.files[0]);
        setReelVideo(event.target.files[0]);
      };
  return (
    <div className='upload_video_container'>
        <h2 >Upload a Video Post</h2>
        <input type="file" accept="video/*" onChange={handleFileChange} />
    </div>
  )
}

export default VideoUploadComponent