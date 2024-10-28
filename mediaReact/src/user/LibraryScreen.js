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
  const [likedSongs,setLikesSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
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

  const fetchlikedmusic = async () => {
    try {
      const user = Number(userid);
      const response = await axios.get(`${API_URL}/api/v2/${user}/UserAudios`);
      setLikesSongs(response.data);
    } catch (error) {
      console.error('Error fetching Watch Later videos:', error);
    }
  };

  const fetchPlaylist = async () => {
    try {
      const user = Number(userid);
      const response = await axios.get(`${API_URL}/api/v2/user/${user}/playlists`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error fetching Watch Later videos:', error);
    }
  };



  useEffect(() => {
    fetchWatchLater();
    fetchlikedmusic();
    fetchPlaylist();
  }, []);

  console.log("watchLater",watchLater);
  console.log("likedSongs",likedSongs);
  console.log("playlist",playlist);

    const [visibleIndex, setVisibleIndex] = useState(null);
    const [watchLaterList, setWatchLaterList] = useState(watchLater); 
    const [likedsonglist,setlikedsonglist] = useState(likedSongs);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const [showCreatePlaylistPopup, setShowCreatePlaylistPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const openCreatePlaylistPopup = () => {
    setShowCreatePlaylistPopup(true);
    setShowPlaylistPopup(false);

  };

  const closeCreatePlaylistPopup = (audioId) => {
    setShowCreatePlaylistPopup(false);
    setTitle(''); // Clear input on close
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = Number(userid); // Ensure userid is a number
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userId', user);
    formData.append('audioId', selectedSong.audioId);

    try {
        const response = await axios.post(`${API_URL}api/v2/createplaylistid`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Automatically handled by axios with FormData
            },
        });
        console.log(`Playlist created with ID: ${response.data.id}`);
        // Optionally, close the pop-up or reset fields
        closeCreatePlaylistPopup(); // Close the pop-up after successful creation
    } catch (error) {
        console.error(error);
        // Optionally, show an error message to the user
    }
};

const handleAddToPlaylistClick = (song) => {
    setSelectedSong(song); // Track which song is being added to the playlist
    setShowPlaylistPopup(true); // Show the playlist pop-up
    setOpenMenuIndex(false);
    console.log("selected song",song)
  };

  const closePopup = () => {
    setShowPlaylistPopup(false); // Close the playlist pop-up
    setSelectedSong(null); // Reset selected song
  };

const toggleRemovesongButton = (index) => {
  // Toggle the visibility of the menu for the specific item
  setOpenMenuIndex(openMenuIndex === index ? null : index);
};

    const toggleRemoveButton = (index) => {
      setVisibleIndex(visibleIndex === index ? null : index);
    };

    const removeFavoriteAudio = async (userId, audioId) => {
      try {
        const formData = new FormData();
        formData.append("audioId", audioId); // Append audioId as a form field
    
        const response = await axios.delete(`${API_URL}/api/v2/${userId}/removeFavoriteAudio`, {
          data: formData, // Pass FormData as the request body
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        if (response.status === 200) {
        console.log(response.data); // Show success message on completion
        fetchlikedmusic();
        return true;
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data); // Error response from server
        } else if (error.request) {
          alert("No response from server. Please try again.");
        } else {
          alert("Error occurred: " + error.message);
        }
      }
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

  const handlesongRemove = async (index) => {
    const user = Number(userid);
    const isRemoved = await removeFavoriteAudio(user, index);
    if (isRemoved) {
      // Update the local state to remove the video from the UI
      const updatedList = likedsonglist.filter((_, i) => i !== index);
      setlikedsonglist(updatedList);
    }
  }

  const handleAddAudio = async (playlistIndex, audioId) => {
     // Assuming your playlist has an `id` field
    try {
      // Send a POST request to add the audio ID to the specified playlist
      const response = await axios.post(`${API_URL}/api/v2/${playlistIndex}/audio/${audioId}`);
      console.log('Audio added to playlist:', response.data);
      
      // Optionally, you can update the state to reflect the changes
      // e.g., you might want to refresh the playlists or update UI accordingly
  
    } catch (error) {
      console.error('Error adding audio to playlist:', error);
      // Optionally, show an error message to the user
    }
  };
  

  const renderContent = () => {
    switch (selectedCategory) {
      case "likedMusic":
        return (
          <div>
      <h3>Liked Music</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px', width: '1000px' }}>
        {likedSongs.map((item, index) => (
          <div
            key={index}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}
          >
            {/* Image */}
            <img
              src={`${API_URL}/api/v2/image/${item.audioId}`}
              alt="video"
              style={{ width: '50px', height: '50px' }}
            />

            {/* Song Title */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, marginLeft: '10px' }}>
              <p style={{ color: 'white', fontSize: '14px', margin: '0' }}>{item.audioTitle}</p>
            </div>

            {/* Three dots icon */}
            <div
              onClick={() => toggleRemovesongButton(index)}
              style={{
                cursor: 'pointer',
                color: 'white',
                fontSize: '20px',
                position: 'relative',
                marginLeft: 'auto',
              }}
            >
              ⋮
            </div>

            {/* Menu (Remove and Add to Playlist) */}
            {openMenuIndex === index && (
              <div
                style={{
                  position: 'absolute',
                  top: '1%', // Show it below the three dots
                  right: '10px', // Align it to the left of the three dots
                  backgroundColor: 'grey',
                  color: 'white',
                  borderRadius: '5px',
                }}
              >
                <p onClick={() => handlesongRemove(item.audioId)} style={{ cursor: 'pointer', margin: '0', padding: '5px 10px' }}>
                  Remove
                </p>
                <p
                  onClick={() => handleAddToPlaylistClick(item)}
                  style={{ cursor: 'pointer', margin: '0', padding: '5px 10px' }}
                >
                  Add to Playlist
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

       {showPlaylistPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            zIndex: 20,
            width: '300px',
            textAlign:'center'
          }}
        >
          <button 
            onClick={openCreatePlaylistPopup}
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
          >
            Create Playlist
          </button>
          <div style={{ marginBottom: '10px' ,marginLeft:'90px'}}>
    <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
        {playlist.map((title, index) => (
            <li key={index} 
            onClick={() => handleAddAudio(title.id, selectedSong.audioId)}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', // Center items together
                width: '100%', // Full width for equal spacing
                marginBottom: '10px' 
            }}>
                <img 
                    src={vector} 
                    alt="icon" 
                    style={{ width: '20px', height: '20px', marginRight: '10px' }} // Reduced margin
                />
                <span style={{ flex: 1, textAlign: 'left' }}>{title.title}</span>
            </li>
        ))}
    </ul>
</div>





          <button onClick={() => setShowPlaylistPopup(false)} 
            style={{ padding: '10px', backgroundColor: 'white', color: 'black', border: 'none', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      )}

      {/* Create New Playlist Pop-up */}
      {showCreatePlaylistPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            zIndex: 30,
            width: '300px',
          }}
        >
          <h4 style={{textAlign:'center'}}>New Playlist</h4>

          {/* Title Input */}
<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
  <label className="mt-3" style={{ color: 'white', fontSize: '14px', marginRight: '60px' }}>Title</label>
  <input 
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    style={{
      flex: 1, // Reduces the input width
      // maxWidth: '200px', // Optional: sets a maximum width
      border: 'none',
      borderBottom: '1px solid white',
      backgroundColor: 'transparent',
      color: 'white',
      outline: 'none',
      paddingBottom: '5px'
    }}
  />
</div>



          {/* Description Input */}
<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
  <label style={{ color: 'white', fontSize: '14px', marginRight: '10px' }}>Description</label>
  <input 
    type="text"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    style={{
      flex: 1, // Make input take available space
      border: 'none',
      borderBottom: '1px solid white',
      backgroundColor: 'transparent',
      color: 'white',
      outline: 'none',
      paddingBottom: '5px'
    }}
  />
</div>

          {/* Cancel and Create Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button 
              onClick={closeCreatePlaylistPopup}
              style={{
                padding: '10px',
                backgroundColor: 'gray',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
               onClick={handleSubmit} // Calls the handleSubmit function
              style={{
                padding: '10px',
                backgroundColor: 'green',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
        );
      case "watchLater":
        return (
          <div>
  <h3>Watch Later</h3>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '30px' }}>
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
      <div style={{
        marginTop:'50px',
        marginLeft:'410px',

      }}>
      Library
      </div>
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
    borderRadius:'10px',
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
    borderRadius:'10px',
  }}
            onClick={() => setSelectedCategory("watchLater")}
          >
            <img src={video} alt="video" style={{ width: '30px' }} />
            Watch Later
          </button>

          <button 
  className="mb-4 p-3"
  style={{
    height: '100px',  
    width: '75%',     // 75% width of the parent container
    backgroundColor: selectedCategory === "playlist" ? "#2149B1" : "gray",
    color: "white",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center contents inside the button
    gap: '30px',
    margin: '0 auto',  // Centers the button in its parent container
    marginBottom:'50px',
    borderRadius:'10px',
  }}
            onClick={() => setSelectedCategory("playlist")}
          >
            <img src={vector} alt="playlist" style={{ width: '30px' }} />
            Playlist
          </button>
        </div>

<div className="content-area w-75 p-3" 
  style={{ 
    color: "white", 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    maxHeight: '500px',  
    overflowY: 'auto', 
  }}
>
  {renderContent()}
</div>

      </div>
    </Layout>
  );
};

export default LibraryScreen;
