// import React, { useState, useEffect } from 'react';
// import ReactPlayer from 'react-player';
// import { useLocation } from 'react-router-dom';
// import API_URL from '../Config';

// const Userplayer = () => {

//   // const [videoUrl, setVideoUrl] = useState('');
//   const location = useLocation();
//   const log=localStorage.getItem('login');
//   const id = localStorage.getItem('id');
//   const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0); // Track playback time
//   const adTimingsInSeconds = [3600, 4500, 5400]; // Ad timings in seconds

//   const handleProgress = (state) => {
//     // ReactPlayer provides 'playedSeconds', which is the current playback time
//     setCurrentPlaybackTime(Math.floor(state.playedSeconds));
//   };

//   const get = location.state ? location.state.get : null; // Check if location.state exists

  
  
//   useEffect(() => {
//     console.log("EditVideo=" + id);
//     console.log("logedIn" + log);
//     const fetchAudio = async () => {
//       if (get) {
//         console.log(get.id);
//       } else {
//         console.log("No 'get' data found in the state.");
//       }
//     };
//     fetchAudio();
//   }, [get]);


//   return (
// <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
// <ReactPlayer
//   url={`${API_URL}/api/v2/${id}/videofile`} // Example URL, replace it with your video URL
//   playing={true}
//   controls={true}
//   width="100%"
//   height="100%"
//   config={{
//         file: {
//           attributes: {
//             controlsList: 'nodownload'
//           }
//         }
//       }}
// />
// </div>
// );
// }

// export default Userplayer
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
import API_URL from '../Config';

const Userplayer = () => {
  const location = useLocation();
  const log = localStorage.getItem('login');
  const id = localStorage.getItem('id');

  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0); // Track playback time
  const [savedPlaybackTime, setSavedPlaybackTime] = useState(0); // Save playback time before ad
  const [videoUrl, setVideoUrl] = useState(`${API_URL}/api/v2/${id}/videofile`); // Main video URL
  const [isAdPlaying, setIsAdPlaying] = useState(false); // Track if ad is playing
  const [playedAdTimings, setPlayedAdTimings] = useState([]); // Keep track of triggered ad timings
  const [showSkipAd, setShowSkipAd] = useState(false); // Track if Skip Ad button is shown
  const [adTimingsInSeconds, setAdTimingsInSeconds] = useState([]); // Store ad timings in seconds
  const playerRef = useRef(null); // Ref for ReactPlayer
  const skipAdTimerRef = useRef(null); // Timer reference for skip ad

  const handleProgress = (state) => {
    if (!isAdPlaying) {
      // Only update playback time for the main video
      setCurrentPlaybackTime(Math.floor(state.playedSeconds));
    }
  };

  console.log(currentPlaybackTime);

  const handleEnded = () => {
    console.log('Ad video ended');
    if (isAdPlaying) {
      console.log('Switching back to main video');
      setIsAdPlaying(false); // Stop ad playing
      setVideoUrl(`${API_URL}/api/v2/${id}/videofile`); // Switch back to the main video
      setShowSkipAd(false); // Hide Skip Ad button
    }
  };

  const checkAdTiming = (time) => {
    // Check if the current time matches any ad timing and hasn't already been played
    return adTimingsInSeconds.some(
      (adTime) => Math.abs(adTime - time) <= 1 && !playedAdTimings.includes(adTime)
    );
  };

  const handleSkipAd = () => {
    console.log('Skipping ad...');
    setIsAdPlaying(false); // Stop ad playing
    setVideoUrl(`${API_URL}/api/v2/${id}/videofile`); // Switch back to the main video
    setShowSkipAd(false); // Hide Skip Ad button
    if (playerRef.current) {
      playerRef.current.seekTo(savedPlaybackTime, 'seconds'); // Resume main video at saved time
    }
  };

  useEffect(() => {
    // Fetch advertisement timings from backend
    const fetchAdTimings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/get/getadtiming/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAdTimingsInSeconds(data); // Set the ad timings in seconds
        } else {
          console.error('Failed to fetch ad timings');
        }
      } catch (error) {
        console.error('Error fetching ad timings:', error);
      }
    };

    fetchAdTimings();
  }, [id]);

  console.log(adTimingsInSeconds,"ad")


  useEffect(() => {
    if (isAdPlaying) {
      console.log('Ad is playing, not switching');
      return;
    }

    // Check if the playback time matches any unplayed ad timing
    if (checkAdTiming(currentPlaybackTime)) {
      const adTime = adTimingsInSeconds.find(
        (adTime) => Math.abs(adTime - currentPlaybackTime) <= 1
      );
      console.log('Switching to ad video at:', adTime);

      setPlayedAdTimings([...playedAdTimings, adTime]); // Mark this ad timing as played
      setSavedPlaybackTime(currentPlaybackTime); // Save the current playback time
      setVideoUrl(`${API_URL}/api/v2/getadvideo`); // Set URL to ad video
      setIsAdPlaying(true); // Mark ad as playing
    }
  }, [currentPlaybackTime, isAdPlaying, playedAdTimings, id]);

  useEffect(() => {
    if (isAdPlaying) {
      // Show Skip Ad button after 10 seconds
      skipAdTimerRef.current = setTimeout(() => {
        setShowSkipAd(true);
      }, 10000);
    } else {
      // Clear timer when ad ends
      clearTimeout(skipAdTimerRef.current);
    }
    return () => clearTimeout(skipAdTimerRef.current);
  }, [isAdPlaying]);

  useEffect(() => {
    // Resume main video and allow for the next ad to play
    if (!isAdPlaying && playerRef.current && savedPlaybackTime > 0) {
      console.log('Resuming main video at:', savedPlaybackTime);
      playerRef.current.seekTo(savedPlaybackTime, 'seconds');
    }
  }, [isAdPlaying, savedPlaybackTime]);

  useEffect(() => {
    const fetchAudio = async () => {
      if (location.state && location.state.get) {
        console.log(location.state.get.id);
      } else {
        console.log("No 'get' data found in the state.");
      }
    };

    fetchAudio();
  }, [location.state]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      {isAdPlaying && showSkipAd && (
  <button
    onClick={handleSkipAd}
    style={{
      position: 'absolute',
      bottom: '10px', // Place at the bottom
      right: '10px', // Place on the right
      zIndex: 20,
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
  >
    Skip Ad
  </button>
)}

      <ReactPlayer
        ref={playerRef} // Attach ref to ReactPlayer
        url={videoUrl} // Use dynamic URL
        playing={true} // Autoplay
        controls={true} // Keep controls enabled for visibility
        width="100%"
        height="100%"
        onProgress={handleProgress} // Handle playback progress
        onEnded={handleEnded} // Detect when the ad finishes
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload', // Prevent downloading
            },
          },
        }}
        style={{ pointerEvents: isAdPlaying ? 'none' : 'auto' }} // Disable interaction with the player during ad playback
      />
    </div>
  );
};

export default Userplayer;

