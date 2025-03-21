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




// import React, { useState, useEffect, useRef } from 'react';
// import ReactPlayer from 'react-player';
// import { useLocation } from 'react-router-dom';
// import API_URL from '../Config';

// const Userplayer = () => {
//   const location = useLocation();
//   const log = localStorage.getItem('login');
//   const id = localStorage.getItem('id');

//   const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0); // Track playback time
//   const [savedPlaybackTime, setSavedPlaybackTime] = useState(0); // Save playback time before ad
//   const [videoUrl, setVideoUrl] = useState(`${API_URL}/api/v2/${id}/videofile`); // Main video URL
//   const [isAdPlaying, setIsAdPlaying] = useState(false); // Track if ad is playing
//   const [playedAdTimings, setPlayedAdTimings] = useState([]); // Keep track of triggered ad timings
//   const [showSkipAd, setShowSkipAd] = useState(false); // Track if Skip Ad button is shown
//   const [adTimingsInSeconds, setAdTimingsInSeconds] = useState([]); // Store ad timings in seconds
//   const playerRef = useRef(null); // Ref for ReactPlayer
//   const skipAdTimerRef = useRef(null); // Timer reference for skip ad

//   const handleProgress = (state) => {
//     if (!isAdPlaying) {
//       // Only update playback time for the main video
//       setCurrentPlaybackTime(Math.floor(state.playedSeconds));
//     }
//   };

//   console.log(currentPlaybackTime);

//   const handleEnded = () => {
//     console.log('Ad video ended');
//     if (isAdPlaying) {
//       console.log('Switching back to main video');
//       setIsAdPlaying(false); // Stop ad playing
//       setVideoUrl(`${API_URL}/api/v2/${id}/videofile`); // Switch back to the main video
//       setShowSkipAd(false); // Hide Skip Ad button
//     }
//   };

//   const checkAdTiming = (time) => {
//     // Check if the current time matches any ad timing and hasn't already been played
//     return adTimingsInSeconds.some(
//       (adTime) => Math.abs(adTime - time) <= 1 && !playedAdTimings.includes(adTime)
//     );
//   };

//   const handleSkipAd = () => {
//     console.log('Skipping ad...');
//     setIsAdPlaying(false); // Stop ad playing
//     setVideoUrl(`${API_URL}/api/v2/${id}/videofile`); // Switch back to the main video
//     setShowSkipAd(false); // Hide Skip Ad button
//     if (playerRef.current) {
//       playerRef.current.seekTo(savedPlaybackTime, 'seconds'); // Resume main video at saved time
//     }
//   };

//   useEffect(() => {
//     // Fetch advertisement timings from backend
//     const fetchAdTimings = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/v2/get/getadtiming/${id}`);
//         if (response.ok) {
//           const data = await response.json();
//           setAdTimingsInSeconds(data); // Set the ad timings in seconds
//         } else {
//           console.error('Failed to fetch ad timings');
//         }
//       } catch (error) {
//         console.error('Error fetching ad timings:', error);
//     throw error;

//       }
//     };

//     fetchAdTimings();
//   }, [id]);

//   console.log(adTimingsInSeconds,"ad")


//   useEffect(() => {
//     if (isAdPlaying) {
//       console.log('Ad is playing, not switching');
//       return;
//     }

//     // Check if the playback time matches any unplayed ad timing
//     if (checkAdTiming(currentPlaybackTime)) {
//       const adTime = adTimingsInSeconds.find(
//         (adTime) => Math.abs(adTime - currentPlaybackTime) <= 1
//       );
//       console.log('Switching to ad video at:', adTime);

//       setPlayedAdTimings([...playedAdTimings, adTime]); // Mark this ad timing as played
//       setSavedPlaybackTime(currentPlaybackTime); // Save the current playback time
//       setVideoUrl(`${API_URL}/api/v2/getadvideo`); // Set URL to ad video
//       setIsAdPlaying(true); // Mark ad as playing
//     }
//   }, [currentPlaybackTime, isAdPlaying, playedAdTimings, id]);

//   useEffect(() => {
//     if (isAdPlaying) {
//       // Show Skip Ad button after 10 seconds
//       skipAdTimerRef.current = setTimeout(() => {
//         setShowSkipAd(true);
//       }, 10000);
//     } else {
//       // Clear timer when ad ends
//       clearTimeout(skipAdTimerRef.current);
//     }
//     return () => clearTimeout(skipAdTimerRef.current);
//   }, [isAdPlaying]);

//   useEffect(() => {
//     // Resume main video and allow for the next ad to play
//     if (!isAdPlaying && playerRef.current && savedPlaybackTime > 0) {
//       console.log('Resuming main video at:', savedPlaybackTime);
//       playerRef.current.seekTo(savedPlaybackTime, 'seconds');
//     }
//   }, [isAdPlaying, savedPlaybackTime]);

//   useEffect(() => {
//     const fetchAudio = async () => {
//       if (location.state && location.state.get) {
//         console.log(location.state.get.id);
//       } else {
//         console.log("No 'get' data found in the state.");
//       }
//     };

//     fetchAudio();
//   }, [location.state]);

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
//       {isAdPlaying && showSkipAd && (
//   <button
//     onClick={handleSkipAd}
//     style={{
//       position: 'absolute',
//       bottom: '10px', // Place at the bottom
//       right: '10px', // Place on the right
//       zIndex: 20,
//       backgroundColor: 'red',
//       color: 'white',
//       border: 'none',
//       padding: '10px 20px',
//       borderRadius: '5px',
//       cursor: 'pointer',
//     }}
//   >
//     Skip Ad
//   </button>
// )}

//       <ReactPlayer
//         ref={playerRef} // Attach ref to ReactPlayer
//         url={videoUrl} // Use dynamic URL
//         playing={true} // Autoplay
//         controls={true} // Keep controls enabled for visibility
//         width="100%"
//         height="100%"
//         onProgress={handleProgress} // Handle playback progress
//         onEnded={handleEnded} // Detect when the ad finishes
//         config={{
//           file: {
//             attributes: {
//               controlsList: 'nodownload', // Prevent downloading
//             },
//           },
//         }}
//         style={{ pointerEvents: isAdPlaying ? 'none' : 'auto' }} // Disable interaction with the player during ad playback
//       />
//     </div>
//   );
// };

// export default Userplayer;

// import React, { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import * as dashjs from "dashjs";  // Fixed import
// import API_URL from "../Config";

// const Userplayer = () => {
//   const location = useLocation();
//   const id = localStorage.getItem("id");

//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const [videoUrl, setVideoUrl] = useState(`${API_URL}/api/v2/${id}/dash/manifest.mpd`);
//   const [isAdPlaying, setIsAdPlaying] = useState(false);
//   const [savedPlaybackTime, setSavedPlaybackTime] = useState(0);
//   const [showSkipAd, setShowSkipAd] = useState(false);
//   const [adTimingsInSeconds, setAdTimingsInSeconds] = useState([30, 90, 150]); // Example ad times
//   const [playedAdTimings, setPlayedAdTimings] = useState([]);

//   useEffect(() => {
//     if (videoRef.current) {
//       const player = dashjs.MediaPlayer().create(); // Initialize DASH.js
//       player.initialize(videoRef.current, videoUrl, true);
//       playerRef.current = player;

//       player.on(dashjs.MediaPlayer.events["PLAYBACK_TIME_UPDATED"], () => {
//         const currentTime = player.time();
//         if (
//           !isAdPlaying &&
//           adTimingsInSeconds.some(
//             (adTime) => Math.abs(adTime - currentTime) <= 1 && !playedAdTimings.includes(adTime)
//           )
//         ) {
//           const adTime = adTimingsInSeconds.find(
//             (adTime) => Math.abs(adTime - currentTime) <= 1
//           );
//           setPlayedAdTimings([...playedAdTimings, adTime]);
//           setSavedPlaybackTime(currentTime);
//           playAd();
//         }
//       });
//     }

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.reset();
//       }
//     };
//   }, [videoUrl]);

//   const playAd = () => {
//     setIsAdPlaying(true);
//     setVideoUrl(`${API_URL}/api/v2/getadvideo`);
//     setShowSkipAd(false);

//     setTimeout(() => {
//       setShowSkipAd(true);
//     }, 10000);
//   };

//   const handleSkipAd = () => {
//     setIsAdPlaying(false);
//     setVideoUrl(`${API_URL}/api/v2/${id}/dash/manifest.mpd`);
//     setShowSkipAd(false);
//   };

//   return (
//     <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
//       {isAdPlaying && showSkipAd && (
//         <button
//           onClick={handleSkipAd}
//           style={{
//             position: "absolute",
//             bottom: "10px",
//             right: "10px",
//             zIndex: 20,
//             background: "red",
//             color: "white",
//             border: "none",
//             padding: "10px",
//             cursor: "pointer",
//           }}
//         >
//           Skip Ad
//         </button>
//       )}
//       <video ref={videoRef} controls style={{ width: "100%", height: "100%" }} />
//     </div>
//   );
// };

// export default Userplayer;


/* dash*/

// import React, { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import * as dashjs from "dashjs";  // Fixed import
// import API_URL from "../Config";

// const Userplayer = () => {
//   const location = useLocation();
//   const id = localStorage.getItem("id");

//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const [videoUrl, setVideoUrl] = useState(`${API_URL}/api/v2/${id}/dash/manifest.mpd`);

//   useEffect(() => {
//     if (videoRef.current) {
//       const player = dashjs.MediaPlayer().create(); // Initialize DASH.js
//       player.initialize(videoRef.current, videoUrl, true);
//       playerRef.current = player;

//       // Optional: Listen for playback time updates if needed, otherwise remove this
//       player.on(dashjs.MediaPlayer.events["PLAYBACK_TIME_UPDATED"], () => {
//         // You can still track the playback time if needed.
//         const currentTime = player.time();
//         console.log("Current playback time:", currentTime);
//       });
//     }

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.reset();
//       }
//     };
//   }, [videoUrl]);

//   return (
//     <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
//       <video ref={videoRef} controls style={{ width: "100%", height: "100%" }} />
//     </div>
//   );
// };

// export default Userplayer;


/* corrected version */

// import React, { useEffect, useRef, useState } from "react";
// import * as dashjs from "dashjs";
// import API_URL from "../Config";
// import { useLocation } from "react-router-dom";


// const Userplayer = () => {

//   const location = useLocation();
//   const id = localStorage.getItem("id");

//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const [qualities, setQualities] = useState([]);
//   const [selectedQuality, setSelectedQuality] = useState("auto");

//   useEffect(() => {
//     if (!videoRef.current) return;

//     // Initialize Dash.js player
//     const player = dashjs.MediaPlayer().create();
//     player.initialize(videoRef.current, `${API_URL}/api/v2/${id}/dash/manifest.mpd`, true);
//     playerRef.current = player;

//     player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
//       const videoTracks = player.getTracksFor("video");
//       console.log("Available Video Tracks:", videoTracks);

//       if (videoTracks.length > 0) {
//         const bitrateList = videoTracks[0].bitrateList; // Get bitrates

//         if (bitrateList && bitrateList.length > 0) {
//           const qualityOptions = bitrateList.map((br, index) => ({
//             id: index,
//             label: `${(br.bandwidth / 1000).toFixed(0)} kbps`, // Show bitrate instead of resolution
//           }));

//           setQualities([{ id: -1, label: "Auto" }, ...qualityOptions]);
//         } else {
//           console.warn("No bitrate information found in MPD file.");
//         }
//       }
//     });

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.reset();
//       }
//     };
//   }, []);

//   // Function to change video quality manually
//   const handleQualityChange = (event) => {
//     const newQualityIndex = parseInt(event.target.value, 10);
//     setSelectedQuality(newQualityIndex);
  
//     // Log available methods
//     console.log("Selected Quality Index:", newQualityIndex);
//     console.log("Player Instance:", playerRef.current);
  
//     if (playerRef.current) {
//       if (newQualityIndex === -1) {
//         console.log("Switching to Auto mode...");
//         playerRef.current.updateSettings({
//           streaming: { abr: { autoSwitchBitrate: { video: true } } },
//         });
//       } else {
//         console.log(`Manually setting quality to index: ${newQualityIndex}`);
//         playerRef.current.updateSettings({
//           streaming: { abr: { autoSwitchBitrate: { video: false } } },
//         });
  
//         // Use the alternative function to set quality
//         playerRef.current.setRepresentationForTypeByIndex('video', newQualityIndex);
//       }
//     }
//   };
  

//   return (
//     <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
//       <video ref={videoRef} controls style={{ width: "100%", height: "100%" }} />

//       {/* Quality Selection Dropdown */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: 10,
//           right: 10,
//           zIndex: 100,
//           background: "rgba(0, 0, 0, 0.7)",
//           padding: "8px",
//           borderRadius: "5px",
//         }}
//       >
//         <label style={{ marginRight: 5, color: "white" }}>Quality:</label>
//         <select
//           onChange={handleQualityChange}
//           value={selectedQuality}
//           style={{
//             padding: "5px",
//             background: "white",
//             border: "none",
//             borderRadius: "3px",
//             cursor: "pointer",
//           }}
//         >
//           {qualities.map((quality) => (
//             <option key={quality.id} value={quality.id}>
//               {quality.label}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Userplayer;


// import React, { useEffect, useRef, useState } from "react";
// import "video.js/dist/video-js.css"; // Video.js styles
// import videojs from "video.js";
// import "videojs-contrib-dash"; // DASH plugin for Video.js
// import API_URL from "../Config";

// const Userplayer = () => {
//   const id = localStorage.getItem("id");
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const [qualities, setQualities] = useState([]);
//   const [selectedQuality, setSelectedQuality] = useState("auto");
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [showSettings, setShowSettings] = useState(false);
//   const [submenu, setSubmenu] = useState(null); // Submenu state

//   useEffect(() => {
//     if (!videoRef.current) return;

//     // Initialize Video.js Player for DASH Streaming
//     const player = videojs(videoRef.current, {
//       controls: true,
//       autoplay: false,
//       preload: "auto",
//       fluid: true,
//       techOrder: ["html5"], // Only HTML5 tech should be used for now
//       pictureInPictureToggle: true, // Enable PiP
//       controlBar: {
//         pictureInPictureToggle: true, // Ensure PiP button is added
//       },
//       sources: [
//         {
//           src: `${API_URL}/api/v2/${id}/dash/manifest.mpd`, // Path to your DASH stream (manifest.mpd)
//           type: "application/dash+xml", // MIME type for DASH
//         },
//       ],
//     });

//     playerRef.current = player;

//     // Wait for player to be ready
//     player.ready(() => {
//       console.log("Player is ready.");

//       // Access the DASH plugin and track information
//       const dashPlayer = player.dash;

//       if (dashPlayer) {
//         console.log("DASH Player:", dashPlayer);
//         const videoTracks = dashPlayer.getTracksFor("video");
//         console.log("Available Video Tracks:", videoTracks);

//         if (videoTracks.length > 0) {
//           const bitrateList = videoTracks[0].bitrateList;

//           if (bitrateList && bitrateList.length > 0) {
//             const qualityOptions = bitrateList.map((br, index) => ({
//               id: index,
//               label: `${(br.bandwidth / 1000).toFixed(0)} kbps`,
//             }));

//             setQualities([{ id: -1, label: "Auto" }, ...qualityOptions]);
//           }
//         }
//       } else {
//         console.log("DASH Player is not available.");
//       }
//     });

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.dispose();
//       }
//     };
//   }, [id]);

//   // Handle Quality Change
//   const handleQualityChange = (quality) => {
//     setSelectedQuality(quality);
//     setShowSettings(false); // Close menu after selection

//     if (playerRef.current) {
//       const dashPlayer = playerRef.current.tech({ IWillNotUseThisInPlugins: true }).vjs_dash;

//       if (dashPlayer) {
//         if (quality === -1) {
//           dashPlayer.updateSettings({
//             streaming: { abr: { autoSwitchBitrate: { video: true } } },
//           });
//         } else {
//           dashPlayer.updateSettings({
//             streaming: { abr: { autoSwitchBitrate: { video: false } } },
//           });

//           dashPlayer.setRepresentationForTypeByIndex("video", quality);
//         }
//       }
//     }
//   };

//   // Handle Playback Speed Change
//   const handleSpeedChange = (speed) => {
//     setPlaybackSpeed(speed);
//     setShowSettings(false); // Close menu after selection
//     if (playerRef.current) {
//       playerRef.current.playbackRate(speed);
//     }
//   };

//   // Toggle Picture-in-Picture Mode
//   const handlePiP = () => {
//     if (document.pictureInPictureElement) {
//       document.exitPictureInPicture();
//     } else if (videoRef.current) {
//       videoRef.current.requestPictureInPicture();
//     }
//     setShowSettings(false); // Close menu
//   };

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100%" }}>
//       {/* Video.js Player */}
//       <video ref={videoRef} className="video-js vjs-default-skin" />

//       {/* Settings Menu (Hidden Initially) */}
//       {showSettings && (
//         <div
//           id="settings-menu"
//           style={{
//             position: "absolute",
//             bottom: 50,
//             right: 20,
//             background: "rgba(0, 0, 0, 0.8)",
//             color: "white",
//             padding: "10px",
//             borderRadius: "5px",
//             zIndex: 100,
//             minWidth: "200px",
//           }}
//         >
//           {!submenu && (
//             <>
//               <div
//                 style={menuItemStyle}
//                 onClick={() => setSubmenu("speed")}
//               >
//                 ⚡ Playback speed
//               </div>
//               <div
//                 style={menuItemStyle}
//                 onClick={() => setSubmenu("quality")}
//               >
//                 🎥 Video Quality
//               </div>
//               <div
//                 style={menuItemStyle}
//                 onClick={handlePiP}
//               >
//                 ⏹️ Picture in Picture
//               </div>
//             </>
//           )}

//           {/* Speed Submenu */}
//           {submenu === "speed" && (
//             <>
//               <div
//                 style={menuItemStyle}
//                 onClick={() => setSubmenu(null)}
//               >
//                 🔙 Back
//               </div>
//               {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
//                 <div
//                   key={speed}
//                   style={menuItemStyle}
//                   onClick={() => handleSpeedChange(speed)}
//                 >
//                   {speed}x
//                 </div>
//               ))}
//             </>
//           )}

//           {/* Quality Submenu */}
//           {submenu === "quality" && (
//             <>
//               <div
//                 style={menuItemStyle}
//                 onClick={() => setSubmenu(null)}
//               >
//                 🔙 Back
//               </div>
//               {qualities.map((quality) => (
//                 <div
//                   key={quality.id}
//                   style={menuItemStyle}
//                   onClick={() => handleQualityChange(quality.id)}
//                 >
//                   {quality.label}
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Menu Item Styling
// const menuItemStyle = {
//   padding: "10px",
//   cursor: "pointer",
//   borderBottom: "1px solid rgba(255,255,255,0.2)",
// };

// export default Userplayer;


import React, { useEffect, useRef, useState } from "react";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import * as dashjs from "dashjs";
import API_URL from "../Config";

// ✅ Custom Settings Button (⚙️)
class QualitySettingsButton extends videojs.getComponent("Button") {
  constructor(player, options) {
    super(player, options);

    this.controlText("Settings");
    this.addClass("vjs-settings-button");

    // Create a settings icon (⚙️)
    const icon = document.createElement("span");
    icon.innerHTML = "&#9881;";
    icon.style.color = "white";
    icon.style.fontSize = "18px";
    this.el().appendChild(icon);

    // Handle Click: Open Menu
    this.on("click", () => {
      options.onClick();
    });
  }
}

// Register button in Video.js
videojs.registerComponent("QualitySettingsButton", QualitySettingsButton);

const Userplayer = () => {
  const id = localStorage.getItem("id");
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [qualities, setQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [showMenu, setShowMenu] = useState(false);
  const [submenu, setSubmenu] = useState(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true,
      techOrder: ["html5"],
      sources: [
        {
          src: `${API_URL}/api/v2/${id}/dash/manifest.mpd`,
          type: "application/dash+xml",
        },
      ],
    });

    playerRef.current = player;

    // Initialize Dash.js for streaming
    const dashPlayer = dashjs.MediaPlayer().create();
    dashPlayer.initialize(videoRef.current, `${API_URL}/api/v2/${id}/dash/manifest.mpd`, true);
    player.dashPlayer = dashPlayer; // Attach Dash.js to Video.js

    dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      const videoTracks = dashPlayer.getTracksFor("video");
    
      if (videoTracks.length > 0) {
        const bitrateList = videoTracks[0].bitrateList;
    
        if (bitrateList && bitrateList.length > 0) {
          const qualityOptions = bitrateList.map((br, index) => ({
            id: index,
            label: `${(br.bandwidth / 1000).toFixed(0)} kbps`,
          }));
    
          setQualities([{ id: -1, label: "Auto" }, ...qualityOptions]);
    
          // ✅ Set "Auto" as the default selected quality
          setSelectedQuality(-1);
        }
      }
    });
    

    // ✅ Add custom settings button to control bar
    const settingsButton = new QualitySettingsButton(player, {
      onClick: () => setShowMenu((prev) => !prev), // Toggle menu
    });

    player.controlBar.addChild(settingsButton, {}, player.controlBar.children().length - 2);

    return () => {
      if (dashPlayer) dashPlayer.reset();
      if (player) player.dispose();
    };
  }, [id]);

  // ✅ Handle Quality Change
  const handleQualityChange = (qualityId) => {
    setSelectedQuality(qualityId);

    if (playerRef.current && playerRef.current.dashPlayer) {
      const dashPlayer = playerRef.current.dashPlayer;
      if (qualityId === -1) {
        dashPlayer.updateSettings({
          streaming: { abr: { autoSwitchBitrate: { video: true } } },
        });
      } else {
        dashPlayer.updateSettings({
          streaming: { abr: { autoSwitchBitrate: { video: false } } },
        });
        dashPlayer.setRepresentationForTypeByIndex("video", qualityId);
      }
    }

    setShowMenu(false);
  };

  // ✅ Handle Playback Speed Change
  const handleSpeedChange = (speed) => {
    if (playerRef.current) {
      playerRef.current.playbackRate(speed);
    }
    setShowMenu(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Video.js Player */}
      <video ref={videoRef} className="video-js vjs-default-skin"/>

      {/* ✅ Settings Menu */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "20px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 100,
            minWidth: "200px",
          }}
        >
          {!submenu ? (
            <>
              <div style={menuItemStyle} onClick={() => setSubmenu("quality")}>
                🎥 Video Quality
              </div>
              <div style={menuItemStyle} onClick={() => setSubmenu("speed")}>
                ⚡ Playback Speed
              </div>
              <div style={menuItemStyle} onClick={() => setShowMenu(false)}>
                ❌ Close
              </div>
            </>
          ) : (
            <>
              <div style={menuItemStyle} onClick={() => setSubmenu(null)}>
                🔙 Back
              </div>

              {/* ✅ Video Quality Options */}
              {submenu === "quality" &&
                qualities.map((quality) => (
                  <div
                    key={quality.id}
                    style={{
                      ...menuItemStyle,
                      background: selectedQuality === quality.id ? "rgba(255,255,255,0.3)" : "transparent",
                    }}
                    onClick={() => handleQualityChange(quality.id)}
                  >
                    {quality.label}
                  </div>
                ))}

              {/* ✅ Playback Speed Options */}
              {submenu === "speed" &&
                [0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <div
                    key={speed}
                    style={menuItemStyle}
                    onClick={() => handleSpeedChange(speed)}
                  >
                    {speed}x
                  </div>
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ✅ Menu Item Styling
const menuItemStyle = {
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
};

export default Userplayer;



// import React, { useEffect, useRef, useState } from "react";
// import "video.js/dist/video-js.css";
// import "videojs-contrib-dash";
// import videojs from "video.js";
// import * as dashjs from "dashjs";
// import API_URL from "../Config";

// // ✅ Custom Settings Button (⚙️)
// class QualitySettingsButton extends videojs.getComponent("Button") {
//   constructor(player, options) {
//     super(player, options);
//     this.controlText("Settings");
//     this.addClass("vjs-settings-button");

//     // Create a settings icon (⚙️)
//     const icon = document.createElement("span");
//     icon.innerHTML = "&#9881;";
//     icon.style.color = "white";
//     icon.style.fontSize = "18px";
//     this.el().appendChild(icon);

//     // Handle Click: Open Menu
//     this.on("click", () => {
//       options.onClick();
//     });
//   }
// }

// // Register button in Video.js
// videojs.registerComponent("QualitySettingsButton", QualitySettingsButton);

// const Userplayer = () => {
//   const id = localStorage.getItem("id");
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const [qualities, setQualities] = useState([]);
//   const [selectedQuality, setSelectedQuality] = useState("auto");
//   const [showMenu, setShowMenu] = useState(false);
//   const [submenu, setSubmenu] = useState(null);

//   useEffect(() => {
//     if (!videoRef.current) return;

//     // ✅ Initialize Video.js player with DASH support
//     const player = videojs(videoRef.current, {
//       controls: true,
//       autoplay: false,
//       preload: "auto",
//       fluid: true,
//       techOrder: ["html5", "dash"],
//       sources: [
//         {
//           src: `${API_URL}/api/v2/${id}/dash/manifest.mpd`,
//           type: "application/dash+xml",
//         },
//       ],
//     });

//     playerRef.current = player;

//     // ✅ Ensure progress bar updates properly
//     player.on("timeupdate", () => {
//       const progressControl = player.controlBar.getChild("progressControl");
//       if (progressControl) {
//         progressControl.children().forEach((child) => {
//           if (child.update) child.update(); // Update if child has update method
//         });
//       }
//     });

//     // ✅ Handle Quality Selection
//     player.on("loadedmetadata", () => {
//           // Initialize Dash.js for streaming
//     const dashPlayer = dashjs.MediaPlayer().create();
//     dashPlayer.initialize(videoRef.current, `${API_URL}/api/v2/${id}/dash/manifest.mpd`, true);
//     player.dashPlayer = dashPlayer; // Attach Dash.js to Video.js

//     dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
//       const videoTracks = dashPlayer.getTracksFor("video");

//       if (videoTracks.length > 0) {
//         const bitrateList = videoTracks[0].bitrateList;

//         if (bitrateList && bitrateList.length > 0) {
//           const qualityOptions = bitrateList.map((br, index) => ({
//             id: index,
//             label: `${(br.bandwidth / 1000).toFixed(0)} kbps`,
//           }));

//           setQualities([{ id: -1, label: "Auto" }, ...qualityOptions]);
//         }
//       }
//     })
//   });

//     // ✅ Add custom settings button
//     const settingsButton = new QualitySettingsButton(player, {
//       onClick: () => setShowMenu((prev) => !prev),
//     });

//     player.controlBar.addChild(settingsButton, {}, player.controlBar.children().length - 2);

//     return () => {
//       if (player) player.dispose();
//     };
//   }, [id]);

//   // ✅ Handle Quality Change
//   const handleQualityChange = (qualityId) => {
//     setSelectedQuality(qualityId);
//     if (playerRef.current) {
//       const dashPlayer = playerRef.current.tech(true).vjs_dash;
//       if (dashPlayer) {
//         if (qualityId === -1) {
//           dashPlayer.updateSettings({
//             streaming: { abr: { autoSwitchBitrate: { video: true } } },
//           });
//         } else {
//           dashPlayer.updateSettings({
//             streaming: { abr: { autoSwitchBitrate: { video: false } } },
//           });
//           dashPlayer.setRepresentationForTypeByIndex("video", qualityId);
//         }
//       }
//     }
//     setShowMenu(false);
//   };

//   // ✅ Handle Playback Speed Change
//   const handleSpeedChange = (speed) => {
//     if (playerRef.current) {
//       playerRef.current.playbackRate(speed);
//     }
//     setShowMenu(false);
//   };

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100%" }}>
//       {/* Video.js Player */}
//       <video ref={videoRef} className="video-js vjs-default-skin" />

//       {/* ✅ Settings Menu */}
//       {showMenu && (
//         <div
//           style={{
//             position: "absolute",
//             bottom: "60px",
//             right: "20px",
//             background: "rgba(0, 0, 0, 0.8)",
//             color: "white",
//             padding: "10px",
//             borderRadius: "5px",
//             zIndex: 100,
//             minWidth: "200px",
//           }}
//         >
//           {!submenu ? (
//             <>
//               <div style={menuItemStyle} onClick={() => setSubmenu("quality")}>
//                 🎥 Video Quality
//               </div>
//               <div style={menuItemStyle} onClick={() => setSubmenu("speed")}>
//                 ⚡ Playback Speed
//               </div>
//               <div style={menuItemStyle} onClick={() => setShowMenu(false)}>
//                 ❌ Close
//               </div>
//             </>
//           ) : (
//             <>
//               <div style={menuItemStyle} onClick={() => setSubmenu(null)}>
//                 🔙 Back
//               </div>

//               {/* ✅ Video Quality Options */}
//               {submenu === "quality" &&
//                 qualities.map((quality) => (
//                   <div
//                     key={quality.id}
//                     style={{
//                       ...menuItemStyle,
//                       background: selectedQuality === quality.id ? "rgba(255,255,255,0.3)" : "transparent",
//                     }}
//                     onClick={() => handleQualityChange(quality.id)}
//                   >
//                     {quality.label}
//                   </div>
//                 ))}

//               {/* ✅ Playback Speed Options */}
//               {submenu === "speed" &&
//                 [0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
//                   <div key={speed} style={menuItemStyle} onClick={() => handleSpeedChange(speed)}>
//                     {speed}x
//                   </div>
//                 ))}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ✅ Menu Item Styling
// const menuItemStyle = {
//   padding: "10px",
//   cursor: "pointer",
//   borderBottom: "1px solid rgba(255,255,255,0.2)",
// };

// export default Userplayer;

