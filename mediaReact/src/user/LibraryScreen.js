import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../Config';
import Layout from '../user/Layout/Layout';
import Thumbs from '../user/UserIcon/Thumbs Up.png';
import vector from '../user/UserIcon/Vector.png';
import video from '../user/UserIcon/Video Playlist.png';

const LibraryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("likedMusic");
  const [watchLater, setWatchlater] = useState([]);
  const userid = sessionStorage.getItem("userId");

  const fetchWatchLater = async () => {
    try {
      const user = Number(userid);
      const response = await axios.get(`${API_URL}/api/v2/${user}/Watchlater`);
      setWatchlater(response.data);
    } catch (error) {
      console.error('Error fetching Watch Later videos:', error);
    }
  };

  useEffect(() => {
    fetchWatchLater();
  }, []);

    // State to manage which item's remove button is visible
    const [visibleIndex, setVisibleIndex] = useState(null);

    // Function to toggle the visibility of the remove button
    const toggleRemoveButton = (index) => {
      setVisibleIndex(visibleIndex === index ? null : index);
    };
  
    // Function to handle removing an item
    const handleRemove = (index) => {
      // Logic to remove the item from watchLater
      console.log(`Removing video at index: ${index}`);
      // You can also call a function passed as props or dispatch an action here
    };
  

  const renderContent = () => {
    switch (selectedCategory) {
      case "likedMusic":
        return (
          <div>
            <h3>Liked Music</h3>
            {/* Add liked music rendering here */}
          </div>
        );
      case "watchLater":
        return (
          // <div>
          //   <h3>Watch Later</h3>
          //   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' ,marginTop:'10px'}}>
          //     {watchLater.map((item, index) => (
          //       <div key={index} style={{
          //         display: 'flex', 
          //         flexDirection: 'column',
          //         alignItems: 'center',
          //         width: '120px',
          //         marginBottom: '10px',
          //         textAlign: 'center'
          //       }}>
          //         <img
          //           src={`${API_URL}/api/v2/${item.videoId}/videothumbnail`}
          //           alt="video"
          //           style={{ width: '150px', height: '150px', borderRadius: '8px' }}
          //         />
          //         <p style={{ color: 'white', fontSize: '14px' }}>{item.videoTitle}</p>
          //         {/* <button style={{
          //           backgroundColor: '#d9534f', 
          //           color: 'white', 
          //           border: 'none', 
          //           padding: '5px 10px', 
          //           borderRadius: '5px',
          //           cursor: 'pointer'
          //         }}>Remove</button> */}
                  
          //       </div>
          //     ))}
          //   </div>
          // </div>
          <div>
      <h3>Watch Later</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
        {watchLater.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '120px',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            <img
              src={`${API_URL}/api/v2/${item.videoId}/videothumbnail`}
              alt="video"
              style={{ width: '150px', height: '150px', borderRadius: '8px' }}
            />
            <p style={{ color: 'white', fontSize: '14px' }}>{item.videoTitle}</p>
            
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => toggleRemoveButton(index)}
                style={{
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '20px',
                  margin: '5px 0'
                }}
              >
                ⋮ {/* This represents the three vertical dots */}
              </div>

              {visibleIndex === index && (
                <button style={{
                  backgroundColor: '#d9534f',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  position: 'absolute',
                  top: '20px', // Adjust as needed
                  left: '-30px', // Adjust as needed
                }} onClick={() => handleRemove(index)}>
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
        );
      case "playlist":
        return (
          <div>
            <h3>Playlists</h3>
            {/* Add playlist rendering here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container d-flex" style={{ height: '70vh', alignItems: 'flex-start' }}>
        {/* Left sidebar */}
        <div className="w-25 p-3" style={{ color: "white" }}>

        <button 
  className="p-3"
  style={{
    height: '100px',  // Increased height
    width: '75%',     // 75% width of the parent container
    backgroundColor: selectedCategory === "likedMusic" ? "#2149B1" : "gray",
    color: "white",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center contents inside the button
    gap: '30px',
    margin: '0 auto',  // Centers the button in its parent container
    marginBottom:'50px',
  }}
  onClick={() => setSelectedCategory("likedMusic")}
>
  <img src={Thumbs} alt="thumbs" style={{ width: '30px' }} />
  Liked Music
</button>

         <button 
  className="p-3"
  style={{
    height: '100px',  // Increased height
    width: '75%',     // 75% width of the parent container
    backgroundColor: selectedCategory === "watchLater" ? "#2149B1" : "gray",
    color: "white",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center contents inside the button
    gap: '30px',
    margin: '0 auto',  // Centers the button in its parent container
    marginBottom:'50px',
  }}
            onClick={() => setSelectedCategory("watchLater")}
          >
            <img src={video} alt="video" style={{ width: '30px' }} />
            Watch Later
          </button>

          <button 
  className="mb-4 p-3"
  style={{
    height: '100px',  // Increased height
    width: '75%',     // 75% width of the parent container
    backgroundColor: selectedCategory === "playlist" ? "#2149B1" : "gray",
    color: "white",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center contents inside the button
    gap: '30px',
    margin: '0 auto',  // Centers the button in its parent container
    marginBottom:'50px',
  }}
            onClick={() => setSelectedCategory("playlist")}
          >
            <img src={vector} alt="playlist" style={{ width: '30px' }} />
            Playlist
          </button>
        </div>

        {/* Content Area
        <div className="content-area w-75 p-3" 
             style={{ 
               color: "white", 
               display: 'flex', 
               flexDirection: 'column', 
               alignItems: 'flex-start', 
               justifyContent: 'flex-start',  // Added to align to the top
               minHeight: '100vh' 
              }}>
          {renderContent()}
        </div> */}

<div className="content-area w-75 p-3" 
  style={{ 
    color: "white", 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    maxHeight: '500px',  // Set the max height to control scrolling
    overflowY: 'auto',   // Enables vertical scrolling
  }}
>
  {renderContent()}
</div>

      </div>
    </Layout>
  );
};

export default LibraryScreen;
