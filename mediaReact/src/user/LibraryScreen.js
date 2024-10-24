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

  console.log("watchLater",watchLater);

    // State to manage which item's remove button is visible
    const [visibleIndex, setVisibleIndex] = useState(null);
    const [watchLaterList, setWatchLaterList] = useState(watchLater); // Store the watch later list


    // Function to toggle the visibility of the remove button
    const toggleRemoveButton = (index) => {
      setVisibleIndex(visibleIndex === index ? null : index);
    };

    const removeWatchLater = async (userId, videoId) => {
      try {
        const response = await axios.delete(`${API_URL}/api/v2/${userId}/removewatchlater`, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: { videoId: videoId },  // Pass the videoId in the data object
        });
    
        if (response.status === 200) {
          console.log(response.data); // "Video removed from watchlater successfully"
          fetchWatchLater();
          return true; // Indicate success
          
        } else {
          console.error(response.data); // Error message from the server
          return false; // Indicate failure
        }
      } catch (error) {
        console.error("Error removing video from watchlater", error);
        return false;
      }
    };
    
    

  
     // Handle removing a video and updating the UI
  const handleRemove = async (index) => {
    const user = Number(userid);
    console.log("user",index,user);
    // Call the API to remove the video
    const isRemoved = await removeWatchLater(user, index);

    if (isRemoved) {
      // Update the local state to remove the video from the UI
      const updatedList = watchLaterList.filter((_, i) => i !== index);
      setWatchLaterList(updatedList);
    }
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
          <div>
  <h3>Watch Later</h3>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '10px' }}>
    {watchLater.map((item, index) => (
      <div className='watchlater' key={index}>
        <img
          src={`${API_URL}/api/v2/${item.videoId}/videothumbnail`}
          alt="video"

        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <p style={{ color: 'white', fontSize: '14px', marginRight: 'auto' }}>{item.videoTitle}</p>

          {/* The three vertical dots */}
          <div
            onClick={() => toggleRemoveButton(index)}
            style={{
              cursor: 'pointer',
              color: 'white',
              fontSize: '20px',
              marginLeft: '5px',
              position: 'relative', // Keep relative positioning here for alignment with the remove button
            }}
          >
            ⋮
          </div>

          {/* Display Remove button when visibleIndex matches */}
          {visibleIndex === index && (
            <button className='.remove' style={{
              
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              position: 'absolute', // Absolute positioning for the button
              top: '100%',  // Position the button directly under the three dots
              left: '50%',  // Center the button horizontally under the dots
              transform: 'translateX(-50%)',  // Adjust centering
              zIndex: 1  // Ensure the button appears above other elements
            }} onClick={() => handleRemove(item.videoId)}>
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
