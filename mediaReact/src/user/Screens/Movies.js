import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import API_URL from '../../Config';
import axios from 'axios';
import leftarrowIcon from '../UserIcon/left slide icon.png';
import rightarrowIcon from '../UserIcon/right slide icon.png';
import { Link, useNavigate } from 'react-router-dom';

const MoviesPage = () => {
  const [states, setStates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState({}); // Object to track current indices per category
  const [videoBanners, setVideoBanners] = useState([]); // State to store banner data
  const [bannerIndex, setBannerIndex] = useState(0); // Track banner index for sliding
  const userid = sessionStorage.getItem("userId");

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Fetch user information from your backend
  //   fetch('http://localhost:8080/auth/userinfo', {
  //     credentials: 'include' // Ensures cookies (session details) are sent
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch user info');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setUserInfo(data);
  //       console.log(data);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user info:', error);
  //       setLoading(false);
  //     });
  // }, []);

  // Fetch video banners (if needed, but not used in your current code)
  const fetchVideoBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/getallvideobanners`);
      // Handle banner data here if necessary
      setVideoBanners(response.data)
    } catch (error) {
      console.error('Error fetching video banners:', error);
    throw error;

    }
  };
  console.log("videoBanners",videoBanners)

  // Fetch video container data
  const fetchVideoContainer = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/getvideocontainer`);
      setStates(response.data);
      console.log("videocontainer",response.data);
    } catch (error) {
      console.error('Error fetching video container:', error);
    throw error;

    }
  };
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'; // Disable automatic scroll restoration
    }
    window.scrollTo(0, 0); // Ensure the page starts at the top
  }, []);
  
  useEffect(() => {
    
    window.scrollTo(0, 0);
    fetchVideoBanners();
    fetchVideoContainer();
  }, []);

  // Automatically update the bannerIndex every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % videoBanners.length);
    }, 4000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [videoBanners.length]);

  const handleNext = () => {
    const container = document.querySelector('.items');
    const containerWidth = container.offsetWidth; // Get the width of the container
    container.scrollLeft += containerWidth; // Scroll to the right by one container width
  };
  
  const handlePrevious = () => {
    const container = document.querySelector('.items');
    const containerWidth = container.offsetWidth; // Get the width of the container
    container.scrollLeft -= containerWidth; // Scroll to the left by one container width
  };
  


  const [play, setPlay] = useState(false); // Define state for play
  const log = localStorage.getItem('login');
  const navigate = useNavigate(); // Define navigate function


  // const handleEdit = (id,categoryid) => {
  //   localStorage.setItem('items', id);
  // };

  const handleEdit = (id, categoryid) => {
    // Create an object to store both id and categoryid
    const item = { id, categoryid };
  
    // Store the item object in local storage as a JSON string
    localStorage.setItem('items', JSON.stringify(item));
    window.scrollTo(0, 0); // Scroll to the top
  };
  
  const handleBanner = (id) =>{
    localStorage.setItem('items', id);
  }


  const handlePlayClick = (videoid) => {
    handleBanner(videoid);
    setPlay(true);
    if (userid) {
      navigate("/play");
    } else {
      navigate("/UserLogin");
    }
  };

  return (
    <Layout>
      {/* Banner Section Displayed at the Top */}
<div className="banner-container mt-3">
  {videoBanners.length > 0 && (
    <div className="banner-items" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
      {videoBanners.map((banner, index) => (
        <div key={index} className="banner-item" 
        // onClick={() => handlePlayClick(banner.videoId)}  
        style={{ cursor: 'pointer' }}>
          <img src={`${API_URL}/api/v2/${banner.videoId}/videoBanner`} alt={`Banner ${index}`} />
        </div>
      ))}
    </div>
  )}
</div>

      <div className="container-list">
        {states.length === 0 ? (
          <div>No content available</div>
        ) : (
          states.map((state) => {
            const videoDescriptions = state.videoDescriptions || [];
            const start = currentIndex[state.value] || 0; // Use state.value for indexing
            const displayedVideos = videoDescriptions.slice(start, start + 6); // Display 6 videos at a time

            return (
              <div key={state.value}>
                <div className="customcontainer">
                  <span>{state.value}</span>
                  <div className="navigation">
                   {/* Left Button */}
<button onClick={handlePrevious}>
  <img
    src={leftarrowIcon}
    alt="left arrow icon"
    style={{ width: "30px", height: "30px", cursor: "pointer" }}
  />
</button>
                    <div className="items">
                      {displayedVideos.length === 0 ? (
                        <div>No videos available</div>
                      ) : (
                        displayedVideos.map((video, index) => {
                          const videoId = video.id;
                          const videoTitle = video.videoTitle;

                          return (
                            <div key={`${videoId}-${state.value}-${index}`} className="item">
                            {/* <div onClick={() => handlePlayClick(videoId)} style={{ cursor: 'pointer' }}> */}
                            <div>
                              <Link
                                to={userid ? `/watchpage/${video.videoTitle}` : "/UserLogin"}
                                onClick={() => handleEdit(video.id,state.categoryid)}
                              >
                                <img
                                  src={`${API_URL}/api/v2/${videoId}/videothumbnail`}
                                  alt={`Video ${videoId}`}
                                />
                              </Link>
                            </div>
                            <p>{videoTitle}</p>
                          
                            {/* <div className="overlay">
                              <p className="video-title">{videoTitle}</p>
                              <p className="video-year">{video.year}</p>
                              <p className="video-duration">{video.mainVideoDuration}</p>
                              <p className="video-category">{state.value}</p>
                            </div> */}
                          </div>
                          

                          );
                        })
                      )}
                    </div>

                  {/* Right Button */}
<button onClick={handleNext}>
  <img
    src={rightarrowIcon}
    alt="right arrow icon"
    style={{ width: "30px", height: "30px", cursor: "pointer" }}
  />
</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default MoviesPage;





