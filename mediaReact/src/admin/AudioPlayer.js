// AudioPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const AudioPlayer = ({ audioSrc }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const current = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        setProgress((current / duration) * 100);
    };

    const handleProgressChange = (event) => {
        const newProgress = event.target.value;
        audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
        setProgress(newProgress);
    };

    useEffect(() => {
        const audioElement = audioRef.current;
        audioElement.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    return (
        <div className='row' > 
            <audio ref={audioRef} src={audioSrc} />
            <ProgressBar  now={progress} className="custom-progress-bar" />
           
            
           {/* <input
                type="range"
                value={progress}
                onChange={handleProgressChange}
                min="0"
                max="100"
                className="audioProgressBarr" // Added class for styling
              
            /> */}
<br></br>

<button onClick={togglePlayPause}>
                {isPlaying ? <i class="bi bi-pause-fill"></i> : <i class="bi bi-play-fill"></i>}
            </button>
        </div>
    );
};

export default AudioPlayer;
