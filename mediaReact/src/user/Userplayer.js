import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
import API_URL from '../Config';

const Userplayer = () => {

  const [videoUrl, setVideoUrl] = useState('');
  const location = useLocation();
  const log=localStorage.getItem('login');
  const id = localStorage.getItem('items');
  const get = location.state ? location.state.get : null; // Check if location.state exists
  
  useEffect(() => {
    console.log("EditVideo=" + id);
    console.log("logedIn" + log);
    const fetchAudio = async () => {
      if (get) {
        console.log(get.id);
      } else {
        console.log("No 'get' data found in the state.");
      }
    };
    fetchAudio();
  }, [get]);


  return (
<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
<ReactPlayer
  url={`${API_URL}/api/play/${id}`} // Example URL, replace it with your video URL
  playing={true}
  controls={true}
  width="100%"
  height="100%"
  config={{
        file: {
          attributes: {
            controlsList: 'nodownload'
          }
        }
      }}
/>
</div>
);
}

export default Userplayer