// AudioPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
const AudioPlayer = ({ audioSrc,audiotitle }) => {
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

    // When the audio source changes, reset the player and start playing the new audio
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause(); // Pause the current audio
            setProgress(0); // Reset progress
            audioRef.current.load(); // Reload the audio source
            setIsPlaying(false); // Set the play state to false

            if (audioSrc) {
                audioRef.current.play(); // Play the new audio automatically
                setIsPlaying(true); // Update play state
            }
        }
    }, [audioSrc]); // This effect runs every time the audioSrc changes

    useEffect(() => {
        const audioElement = audioRef.current;
        audioElement.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    return (
        <div className='row' style={{ padding: '5px', position: 'fixed', width: '100%', bottom: '0px', backgroundColor: '#141334',zIndex: 5  }}> 
            <audio ref={audioRef} src={audioSrc} />
            <div className='col-lg-12'>
                <ProgressBar now={progress} className="custom-progress-bar" />
            </div>
            <div className='row' style={{ padding: '0px' }}> 
            <div className='col-lg-1'></div>

                <div className='col-lg-5'>
                <h3 style={{ color: '#fff', fontSize: 'x-large',paddingTop:'10px' }}>{audiotitle}</h3> {/* Display the audio title */}
                </div>
                
                <div className='col-lg-1'>
                    <button onClick={togglePlayPause} style={{ width:'45px', height:'45px', padding:'5px' }}>
                        {isPlaying ? (
                            <i className="bi bi-pause-fill" style={{ display:'grid', fontSize: 'xx-large' }}></i>
                        ) : (
                            <i className="bi bi-play-fill" style={{ display:'grid', fontSize: 'xx-large' }}></i>
                        )}
                    </button>
                </div>
                <div className='col-lg-5'></div>
            </div>
        </div>
    );
};

export default AudioPlayer;
