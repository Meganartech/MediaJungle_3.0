import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../Config';
import axios from 'axios';


const WatchPage = () => {
  // const id = localStorage.getItem('items');
  // console.log("videoid",id)
  const [getall, setgetall] = useState('');
  const [Thumbnail, setThumbnail] = useState('');
  const [play, setPlay] = useState(false);
  const navigate = useNavigate();
  const log = localStorage.getItem('login');
  const jwtToken = sessionStorage.getItem("token");
  const userid = sessionStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expiryDate, setexpiryDate] = useState('');
  const [currentDate, setcurrentdate] = useState('');
  const [thumbnails, setThumbnails] = useState({});
  const [videocast, setvideocast] = useState([]);
  const [base64, setbase64] = useState([]);
  const [categoriesvaluelist,setcategoriesvaluelist] = useState([]);
  const [castandcrewlist,setcastandcrewlist] = useState([]);

  const subscribed = expiryDate > currentDate;
  const modeofvideo = getall.paid;

  const [id, setId] = useState(null); // Define id as a state variable
  const [categoryid, setCategoryid] = useState(null); // Define categ

  
  const getItemsFromLocalStorage = () => {
    const items = localStorage.getItem('items');
    
    // Parse the JSON string back to an object
    return items ? JSON.parse(items) : null;
  };
  
  // Example of using the retrieved items
  useEffect(() => {
  const storedItem = getItemsFromLocalStorage();
  
  if (storedItem) {
    setId(storedItem.id);
      setCategoryid(storedItem.categoryid);
      console.log('ID:', storedItem.id);
      console.log('Category ID:', storedItem.categoryid);
  }
}, []);
  

  
useEffect(() => {
  const fetchData = async () => {
    try {
      // Construct the URL with query parameters
      const response = await axios.get(`${API_URL}/api/v2/videoscreen`, {
        params: {
          videoId: id,        // Pass videoId as query parameter
          categoryId: categoryid, // Pass categoryId as query parameter
        },
      });
      
      // Fetch video details
      const videoData = response.data;
      setgetall(videoData);
      console.log("videoData",videoData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    }
  };

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/GetUserById/${userid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data);
        if (data && data.paymentId && data.paymentId.expiryDate) {
          setexpiryDate(new Date(data.paymentId.expiryDate));
          setcurrentdate(new Date());
        }
        console.log(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message);
      }
    };

    fetchData();
    fetchUser();
  }, [id, userid,categoryid]);

  useEffect(() => {
    const fetchvideocastandcrew = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v2/Getvideocast`);
        if (response.data) {
          setvideocast(response.data);
          const filteredCast = response.data.filter(
            item => item.videoDescription.id.toString() === id
          );
          const base64Images = filteredCast.map(item => item.castAndCrewImage);
          setbase64(base64Images);
          console.log("videocast", response.data);
          console.log("base64", base64Images);
        }
      } catch (error) {
        console.error('Error fetching thumbnail:', error);
        setError(error.message);
      }
    };

    fetchvideocastandcrew();
  }, [id]);

 const handleEdit = (id) => {
    localStorage.setItem('items', id);
  };

  const handlePlayClick = (videoid) => {
    handleEdit(videoid);
    setPlay(true);
    if (userid) {
      navigate("/play");
    } else {
      navigate("/UserLogin");
    }
  };


  const handleSubscribe = () => {
    navigate('/PlanDetails');
  };

  const [index, setIndex] = useState(0); // Track the starting index of the displayed videos
  const DISPLAY_LIMIT = 5; // Number of videos to display at a time

  // Safely handle undefined or empty videoDescriptions array
  const videos = getall?.videoDescriptions || [];
  const visibleVideos = videos.slice(index, index + DISPLAY_LIMIT);

  const handleNext = () => {
    if (index + DISPLAY_LIMIT < videos.length) {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleEdit1 = (id, categoryid) => {
    // Create an object to store both id and categoryid
    const item = { id, categoryid };
  
    // Store the item object in local storage as a JSON string
    localStorage.setItem('items', JSON.stringify(item));
  };
  


  return (

  
  <Layout>
 
     <div className="videothumbnail position-relative">
    <>
      <img src={`${API_URL}/api/v2/${id}/videothumbnail`} alt="image" className="img-fluid" />
      <div className="overlay-buttons">
        <button id="button1" className="me-4" onClick={() => handlePlayClick(id)}>Play</button>
        <button id="button2" className=" me-4">Add to Watch list</button>
        <i className="bi bi-share-fill share-icon"></i>
      </div>
      <span className="overlay-span">Duration:&nbsp;{getall.duration}</span>
    </>
 
</div>

<div className='content h-100'>
  <div className='title'>
  <span >{getall.videotitle}</span>
  </div>
  <div style={{marginTop:'30px'}}>
  {getall.category && getall.category.length > 0 && (
  <span >{getall.category.join('/')}</span>
 
)}
 </div>
 <div className='castandcrew'>
 <span>Cast & Crew</span>
 {getall.castandcrew && getall.castandcrew.length > 0 && (
  <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
    {getall.castandcrew.map(cast => (
      <div key={cast.id} style={{ textAlign: 'center' }}> {/* Added textAlign for centering */}
        <img
          src={`${API_URL}/api/v2/getcastimage/${cast.id}`} // Assuming cast has an id property
          alt={`Cast member ${cast.name}`} // Assuming cast has a name property
          style={{ width: '100px', height: '100px', borderRadius: '50px', marginTop: '25px' }}
        />
        <p>{cast.name}</p> {/* Displaying the cast member's name */}
      </div>
    ))}
  </div>
)}
 </div>

 
 
 <div className='story'>
  <span className='storyspan'>Story</span>
  <div className='description'>
  <span>{getall.description}</span>
  </div>
 </div>

 
 {/* <div className="suggestion">
 <span className='suggspan'>Suggestion</span>
 </div> */}

 <div className="suggestion">
  <span>Suggestion</span>
  <div className="videoscreenitems">
    {videos.length > 0 && (
      <div className="videoscreenitem-row">
        <button onClick={handlePrev} disabled={index === 0}>&lt;</button>
        {visibleVideos.map((video) => (
          <div key={video.id} className="item">
            <a
              href={userid ? `/watchpage/${video.videoTitle}` : "/UserLogin"}
              onClick={(e) => {
                e.preventDefault(); // Prevent default navigation to handle custom behavior
                if (userid) {
                  handleEdit1(video.id, categoryid);
                  window.location.href = `/watchpage/${video.videoTitle}`; // Force reload
                } else {
                  window.location.href = "/UserLogin";
                }
              }}
            >
              <img
                src={`${API_URL}/api/v2/${video.id}/videothumbnail`}
                alt={`Video ${video.videoTitle}`}
                className="videoscreenthumbnail"
              />
            </a>
            <p>{video.videoTitle}</p>
          </div>
        ))}
        <button
          onClick={handleNext}
          disabled={index + DISPLAY_LIMIT >= videos.length}
        >
          &gt;
        </button>
      </div>
    )}
  </div>
  
</div>





    </div> 
   



  </Layout>
  );
};

export default WatchPage;
