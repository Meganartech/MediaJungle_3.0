import React, { useState, useEffect, useRef } from 'react';
import Layout from '../Layout/Layout';
import axios from 'axios';
import API_URL from '../../Config';
import { FaPlay, FaPause, FaForward, FaBackward, FaTimes ,FaPlus} from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import plus from '../UserIcon/plus button playlist.png';
import vector from '../UserIcon/Vector.png';

const MusicScreen = () => {
  const musicid = localStorage.getItem('item');
  const [musiclist, setMusiclist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [bottomBarSong, setBottomBarSong] = useState(null);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const userId = sessionStorage.getItem("userId");

  const audioRef = useRef(null);
  const currentSong = musiclist[currentSongIndex];
  const [playlist, setPlaylist] = useState([]);

  const fetchPlaylist = async () => {
    try {
      const user = Number(userId);
      const response = await axios.get(`${API_URL}/api/v2/user/${user}/playlists`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error fetching Watch Later videos:', error);
    }
  };

  const fetchMusicList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/getaudiodetails/${musicid}`);
      setMusiclist(response.data);
      if (response.data.length > 0) {
        setBottomBarSong(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching music list:', error);
    }
  };

  useEffect(() => {
    fetchMusicList();
    fetchPlaylist();
  }, []);

  useEffect(() => {
    if (currentSong) {
      const audioSrc = `${API_URL}/api/v2/${currentSong.audio_file_name}/file`;
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const setAudioDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', setAudioDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', setAudioDuration);
      };
    }
  }, []);

  const playSong = () => {
    const audio = audioRef.current;
    setIsPlaying((prevState) => {
      if (audio) {
        if (prevState) {
          audio.pause();
        } else {
          audio.play();
        }
      }
      return !prevState;
    });
    setShowBottomBar(true);
  };

  const playPrevious = () => {
    if (musiclist.length > 0) {
      const previousIndex = currentSongIndex > 0 ? currentSongIndex - 1 : musiclist.length - 1;
      setCurrentSongIndex(previousIndex);
      setBottomBarSong(musiclist[previousIndex]);
     
    }
  };

  const playNext = () => {
    if (musiclist.length > 0) {
      const nextIndex = (currentSongIndex + 1) % musiclist.length;
      setCurrentSongIndex(nextIndex);
      setBottomBarSong(musiclist[nextIndex]);
      
    }
  };

  const playSongFromList = (index) => {
    setCurrentSongIndex(index);
    setBottomBarSong(musiclist[index]);
  };

  const closeBottomBar = () => {
    setShowBottomBar(false);
    setIsPlaying(false);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };


  const songListStyle = {
    maxHeight: musiclist.length > 6 ? '450px' : 'auto', // Show scrollbar only if there are more than 6 songs
    overflowY: musiclist.length > 6 ? 'auto' : 'hidden', // Apply scrolling only if more than 6 songs
  };

  const handleAddToFavorites = async (audioId) => {
    try {
      const response = await axios.post(`${API_URL}/api/v2/favourite/audio`, {
        audioId,
        userId,
      });

      console.log(response.data); // Display success or error message from the backend
      toast.success("Added");
    } catch (error) {
      console.log('Error adding to favorites: ' + error.message); // Handle error
      toast.error("Already Added")
    } 
  };

  
  console.log("song",currentSong)

  const [openplaylistpopup,setopenplaylistpopup] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [popup,setpopup] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
     setopenplaylistpopup(false);
     setpopup(false);


    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  const openCreatePlaylistPopup =() =>{
    setpopup(true);
    
  }

  const playlistpopup = () =>{
    setopenplaylistpopup(true);
    setpopup(false);
  }

  const closeplaylistpopup =() =>{
    setopenplaylistpopup(false);
  }

  const handleAddAudio = async (playlistIndex, audioId) => {
    // Assuming your playlist has an `id` field
   try {
     // Send a POST request to add the audio ID to the specified playlist
     const response = await axios.post(`${API_URL}/api/v2/${playlistIndex}/audio/${audioId}`);
     console.log('Audio added to playlist:', response.data);
     toast.success("Added");
     
     // Optionally, you can update the state to reflect the changes
     // e.g., you might want to refresh the playlists or update UI accordingly
 
   } catch (error) {
     console.error('Error adding audio to playlist:', error);
     toast.error("Error adding audio to playlist");
     // Optionally, show an error message to the user
   }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const user = Number(userId); // Ensure userid is a number
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('userId', user);
  formData.append('audioId', currentSong.id);

  try {
      const response = await axios.post(`${API_URL}/api/v2/createplaylistid`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data', // Automatically handled by axios with FormData
          },
      });
     // Display success toast in top-right corner
     console.log("success");
     toast.success("Successfully created");
     closeplaylistpopup(); // Close the pop-up after successful creation
      fetchPlaylist();
    } catch (error) {
      toast.error("Not created");
      console.error("Error creating playlist:", error.response?.data || error.message);
  
  }
};


  return (
    <Layout>
      <div className="music-player">
        {/* Left Side */}
        <div className="left-side">
          <span style={{ marginBottom: '30px' }}>A R Rahman</span>
          {currentSong ? (
            <>
              <img
                src={`${API_URL}/api/v2/image/${currentSong.id}`}
                alt="Album Art"
                className="album-art"
              />
              <span style={{ fontSize: '20px' }}>{currentSong.audio_title}</span>
            </>
          ) : (
            <p>Loading...</p>
          )}
          <span style={{ fontSize: '20px' }}>(Ok Kanmani)</span>
          <div className="controls">
            <button onClick={playPrevious} className="control-button"><FaBackward /></button>
            <button onClick={playSong} className="control-button">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={playNext} className="control-button"><FaForward /></button>
          </div>

          <div className="actions">
            <button 
             onClick={() => {
              if (currentSong && currentSong.id) {
                handleAddToFavorites(currentSong.id);
              } else {
                console.error('Current song or song ID is not available');
              }
            }}
            className="action-button">
              <i class="fas fa-thumbs-up fs-10"></i> Like
              </button>
            {/* <button  className="action-button"><i class="fas fa-thumbs-up fs-10"></i> Like</button> */}
            <button  
            onClick={openCreatePlaylistPopup}
            className="action-button">
            <i class="fas fa-plus"></i> Playlist
            {/* <i><FaPlus /></i> Playlist */}
            </button>

            {popup && (
  <div
  ref={menuRef}
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(50, 50, 50, 0.5)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      zIndex: 20,
      width: '300px',
      textAlign: 'center',
    }}
  >
    {/* Centered "Create Playlist" Button */}
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
      <button 
        onClick={playlistpopup}
        style={{
          backgroundColor: 'white',
          color: 'black',
          padding: '10px',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <img src={plus} alt="plus" style={{ width: '20px', height: '20px' }} />
        Create Playlist
      </button>
    </div>

    {/* Centered Playlist Items */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      maxHeight: '90px',
      scrollbarWidth: 'thin', // For Firefox
      scrollbarColor: 'black', // Track color (black) and thumb color (dark grey) for Firefox
    }}>
      <style>
        {`
        /* For WebKit browsers (Chrome, Safari, etc.) */
        div::-webkit-scrollbar {
            width: 8px;
        }
        div::-webkit-scrollbar-track {
            background: transparent; /* Scrollbar track color */
        }
        div::-webkit-scrollbar-thumb {
            background-color: black ; /* Scrollbar thumb color */
            border-radius: 4px;
        }
        `}
      </style>

      <style>
  {`
    .playlist-item {
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .playlist-item:hover {
      background-color: rgba(255, 255, 255, 0.1); /* Change to desired hover color */
    }
  `}
</style>

      <ul style={{ listStyleType: 'none', padding: 0, width: '100%' }}>
        {playlist.map((title, index) => (
          <li 
            key={index} 
            className="playlist-item"  // Apply the className for hover effect

            onClick={() => {
              if (currentSong && currentSong.id) {
                handleAddAudio(title.id, currentSong.id);
              } else {
                console.error('Current song or song ID is not available');
              }
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '10px',
              padding: '10 20px'
            }}
          >
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <img 
                src={vector} 
                alt="icon" 
                style={{ width: '20px', height: '20px' }}
              />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              {title.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
            {/* Create New Playlist Pop-up */}
      {openplaylistpopup && (
        <div
        ref={menuRef}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(50, 50, 50, 0.5)',
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
    required
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
    required
  />
</div>

          {/* Cancel and Create Buttons */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
  <button 
    onClick={closeplaylistpopup}
    style={{
      padding: '10px',
      backgroundColor: 'rgb(43,42, 82)',
      color: 'white',
      border: '1px solid white',
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
      backgroundColor: 'blue',
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
            <button onClick={playNext} className="action-button"><i class="bi bi-share"></i> Share
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          <ul className="song-list" style={songListStyle}>
            {musiclist.map((song, index) => (
              <li
                key={song.id}
                className={index === currentSongIndex ? 'active' : ''}
                onClick={() => playSongFromList(index)}
              >
                <div className="song-details">
                  <span>{index + 1}. {song.audio_title}</span>
                  <span className="song-duration">{song.audio_Duration}</span>
                </div>
                <div className="song-artist">A R Rahman - Ok Kanmani</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      {showBottomBar && bottomBarSong && (
        <div className="bottom-bar">
          {/* Progress Bar */}
          <div
            className="progress-line-container"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              handleSeek({ target: { value: newTime } });
            }}
          >
            <div
              className="progress-line"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <img
            src={`${API_URL}/api/v2/image/${bottomBarSong.id}`}
            alt="Bottom Bar Album Art"
            className="bottom-bar-art"
          />
          <div className="bottom-bar-info">
            <span className="bottom-bar-title">{bottomBarSong.audio_title}</span>&nbsp;&nbsp;&nbsp;
            <span className="bottom-bar-artist">A R Rahman - Ok Kanmani</span>
          </div>
          <button onClick={playPrevious} className="control-button"><FaBackward /></button>
          <button onClick={playSong} className="control-button">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={playNext} className="control-button"><FaForward /></button>
          
          {/* Time Display */}
    <div className="bottom-bar-time">
      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
    </div>


          <button onClick={closeBottomBar} className="control-button"><FaTimes /></button>
        </div>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} />
    </Layout>
  );
};

export default MusicScreen;
