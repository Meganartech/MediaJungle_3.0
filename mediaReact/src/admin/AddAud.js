import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull'; // For

const AddAud = () => {
  const audioUrl = 'http://localhost:8080/api/v2/1725080679905_file_example_MP3_1MG.mp3/file'; 


  const backgroundImage = 'https://via.placeholder.com/200'; 

  return (
    <div style={{
      position: 'relative',
      width: '200px',
      height: '200px',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      <ReactPlayer
        url={audioUrl}
        width="100%"
        height="100%"
        controls={true}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
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
};

//   const playerRef = useRef(null);
//   const backgroundImage = 'https://via.placeholder.com/200'; // Replace with your actual image URL

//   return (
//     <div style={{
//       position: 'relative',
//       width: '200px',
//       height: '200px',
//       overflow: 'hidden',
//       backgroundImage: `url(${backgroundImage})`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: '10px',
//     }}>
//       <ReactPlayer
//         ref={playerRef}
//         url={audioUrl}
//         width="200px"
//         height="200px"
//         controls={true}
//         playing={isPlaying}
//         onPlay={() => setIsPlaying(true)}
//         onPause={() => setIsPlaying(false)}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '200px',
//           height: '200px',
//         }}
//         config={{
//           file: {
//             attributes: {
//               controlsList: 'nodownload'
//             }
//           }
//         }}
//       />
//       {!isPlaying && (
//         <img
//           src={backgroundImage}
//           alt="Audio Player Background"
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '200px',
//             height: '200px',
//             objectFit: 'cover',
//             borderRadius: '10px',
//           }}
//         />
//       )}
//       <button
//         onClick={() => setIsPlaying(!isPlaying)}
//         style={{
//           position: 'absolute',
//           bottom: '10px',
//           right: '10px',
//           backgroundColor: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           padding: '5px 10px',
//           cursor: 'pointer',
//           boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//         }}
//       >
//         {isPlaying ? 'Pause' : 'Play'}
//       </button>
//     </div>
//   );
// };
export default AddAud;