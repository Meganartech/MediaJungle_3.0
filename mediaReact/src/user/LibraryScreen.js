import React, { useState } from 'react';
import Layout from '../user/Layout/Layout';
import Thumbs from '../user/UserIcon/Thumbs Up.png';
import vector from '../user/UserIcon/Vector.png';
import video from '../user/UserIcon/Video Playlist.png';

const LibraryScreen = () => {
  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState("likedMusic");

  // Sample data for each category
  const data = {
    likedMusic: [
      { title: "Mental Manadhil", artist: "AR Rahman", album: "Ok Kanmani" },
      { title: "Another Song", artist: "Artist Name", album: "Album Name" },
    ],
    watchLater: [
      { title: "Inception", genre: "Sci-Fi" },
      { title: "The Dark Knight", genre: "Action" },
    ],
    playlist: [
      { title: "My Favourites", count: "10 songs" },
      { title: "Chill Vibes", count: "15 songs" },
    ],
  };

  // Function to render the main content based on the selected category
  const renderContent = () => {
    switch (selectedCategory) {
      case "likedMusic":
        return (
          <div>
            <h3>Liked Music</h3>
            {data.likedMusic.map((item, index) => (
              <div key={index}>
                <p>{item.title} - {item.artist}</p>
                <p>{item.album}</p>
              </div>
            ))}
          </div>
        );
      case "watchLater":
        return (
          <div>
            <h3>Watch Later</h3>
            {data.watchLater.map((item, index) => (
              <div key={index}>
                <p>{item.title} - {item.genre}</p>
              </div>
            ))}
          </div>
        );
      case "playlist":
        return (
          <div>
            <h3>Playlists</h3>
            {data.playlist.map((item, index) => (
              <div key={index}>
                <p>{item.title} - {item.count}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container d-flex">
        {/* Right sidebar for selecting category */}
        <div className="w-25 p-3" style={{ color: "white"}}>
          <div className="">
          <button 
            className="w-60 ml-10 p-2 mb-6 "
            style={{
              height: '100px',
              backgroundColor: selectedCategory === "likedMusic" ? "#2149B1" : "gray",
              color: "white",
            }}
            onClick={() => setSelectedCategory("likedMusic")}
          >          
          <img src={Thumbs} alt='thumbs' />
            Liked Music
          </button>

          </div>
          <div className="">
            <button 
              className="btn btn-primary  w-60 ml-10 p-2 mb-6"
              style={{
                height: '100px',
                backgroundColor: selectedCategory === "watchLater" ? "#2149B1" : "gray",
                color: "white",
              }}
              onClick={() => setSelectedCategory("watchLater")}
            >
              <img src={video} alt='video' />
              Watch Later
            </button>
          </div>
          <div className="">
            <button 
              className="btn btn-primary w-60 ml-10 p-2 mb-6"
              style={{
                height: '100px',
                backgroundColor: selectedCategory === "playlist" ? "#2149B1" : "gray",
                color: "white",
                outline:"none",
              }}
              onClick={() => setSelectedCategory("playlist")}
            >
              <img src={vector} alt='vector' />
              Playlist
            </button>
          </div>
        </div>
         {/* Left content area */}
         <div className="content-area w-75 p-3" style={{  color: "white" }}>
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default LibraryScreen;
