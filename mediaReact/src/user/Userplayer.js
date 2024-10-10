import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
import API_URL from '../Config';

const Userplayer = () => {

  // const [videoUrl, setVideoUrl] = useState('');
  const location = useLocation();
  const log=localStorage.getItem('login');
  const id = localStorage.getItem('id');

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
  url={`${API_URL}/api/v2/${id}/videofile`} // Example URL, replace it with your video URL
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


// import React, { useState, useEffect } from 'react';
// import ReactPlayer from 'react-player';
// import { useLocation } from 'react-router-dom';
// import API_URL from '../Config';

// const Userplayer = () => {
//   const [videoUrl, setVideoUrl] = useState('');
//   const location = useLocation();
//   const log = localStorage.getItem('login');
//   const id = localStorage.getItem('items'); // Ensure this is set before navigating

//   const get = location.state ? location.state.get : null; // Check if location.state exists

//   useEffect(() => {
//     console.log("EditVideo=", id);
//     console.log("LoggedIn=", log);

//     const fetchAudio = async () => {
//       if (get) {
//         console.log("Get ID:", get.id);
//         // Set the video URL based on the id
//         setVideoUrl(`${API_URL}/api/v2/${get.id}/videofile`);
//       } else {
//         console.log("No 'get' data found in the state.");
//       }
//     };
    
//     fetchAudio();
//   }, [get, id]); // Make sure to include id in the dependency array

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
//       {videoUrl ? ( // Check if videoUrl is set
//         <ReactPlayer
//           url={videoUrl} // Use the videoUrl from state
//           playing={true}
//           controls={true}
//           width="100%"
//           height="100%"
//           config={{
//             file: {
//               attributes: {
//                 controlsList: 'nodownload'
//               }
//             }
//           }}
//         />
//       ) : (
//         <p>Loading video...</p> // Show loading text while fetching video
//       )}
//     </div>
//   );
// }

// export default Userplayer;
