import React, { useState, useEffect, useRef } from 'react';
import Layout from '../Layout/Layout';
import axios from 'axios';
import API_URL from '../../Config';
import { FaPlay, FaPause, FaForward, FaBackward, FaTimes } from 'react-icons/fa';

const MusicScreen = () => {
  const musicid = localStorage.getItem('item');
  const [musiclist, setMusiclist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [bottomBarSong, setBottomBarSong] = useState(null);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const currentSong = musiclist[currentSongIndex];

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
  }, []);

  useEffect(() => {
    if (currentSong && isPlaying) {
      const audioSrc = `${API_URL}/api/v2/${currentSong.audio_file_name}/file`;
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.play();
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateTime = () => {
        setCurrentTime(audio.currentTime);
      };

      const setAudioDuration = () => {
        setDuration(audio.duration);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', setAudioDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', setAudioDuration);
      };
    }
  }, [audioRef]);

  const playSong = () => {
    setIsPlaying(!isPlaying);
    setShowBottomBar(true);
  };

  const playPrevious = () => {
    if (musiclist.length > 0) {
      const previousIndex = currentSongIndex > 0 ? currentSongIndex - 1 : musiclist.length - 1;
      setCurrentSongIndex(previousIndex);
      setBottomBarSong(musiclist[previousIndex]);
      setIsPlaying(true);
      setShowBottomBar(true);
    }
  };

  const playNext = () => {
    if (musiclist.length > 0) {
      const nextIndex = (currentSongIndex + 1) % musiclist.length;
      setCurrentSongIndex(nextIndex);
      setBottomBarSong(musiclist[nextIndex]);
      setIsPlaying(true);
      setShowBottomBar(true);
    }
  };

  const playSongFromList = (index) => {
    setCurrentSongIndex(index);
    setBottomBarSong(musiclist[index]);
    setIsPlaying(true);
    setShowBottomBar(true);
  };

  const closeBottomBar = () => {
    setShowBottomBar(false);
    setIsPlaying(false);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Layout>
      <div className="music-player">
        {/* Left Side */}
        <div className="left-side">
          <h1 style={{ marginBottom: '30px' }}>A R Rahman</h1>
          {currentSong ? (
            <>
              <img
                src={`${API_URL}/api/v2/image/${currentSong.id}`}
                alt="Album Art"
                className="album-art"
              />
              <h2 style={{ fontSize: '20px' }}>{currentSong.audio_title}</h2>
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
        </div>

        {/* Right Side */}
        <div className="right-side">
          <ul className="song-list">
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
          <div className="progress-line" style={{ width: `${progressPercentage}%` }}></div>
          <img
            src={`${API_URL}/api/v2/image/${bottomBarSong.id}`}
            alt="Bottom Bar Album Art"
            className="bottom-bar-art"
          />
          <div className="bottom-bar-info">
            <span className="bottom-bar-title">{bottomBarSong.audio_title}</span>
            <span className="bottom-bar-artist">A R Rahman - Ok Kanmani</span>
          </div>
          <button onClick={playPrevious} className="control-button"><FaBackward /></button>
          <button onClick={playSong} className="control-button">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={playNext} className="control-button"><FaForward /></button>
          <button onClick={closeBottomBar} className="control-button"><FaTimes /></button>
        </div>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} />
    </Layout>
  );
};

export default MusicScreen;
