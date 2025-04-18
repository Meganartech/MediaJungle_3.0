import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';
import usericon from '../admin/icon/userico.png';
import music from '../admin/icon/music.png';
import coin from '../admin/icon/coin.png';
import videoicon from '../admin/icon/videoicon.png';
import arrow from '../admin/icon/arrow.png'


const Dashboard = () => {


  const [isvalid, setIsvalid] = useState();
  const [isEmpty, setIsEmpty] = useState();

  useEffect(() => {
   

    fetch(`${API_URL}/api/v2/GetAllUser`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
        // setValid(response.data.valid);
      setIsEmpty(response.data.empty);
      // console.log("Is empty: " + isEmpty); 
      // // console.log("Valid: " + valid);
      // console.log("--------------------------------------------------------------------");
      
      }
      return response.json();
    })
    .then(data => {
      // setValid(data.valid);
      setIsEmpty(data.empty);
      setIsvalid(data.valid)
      // console.log(" Empty "+data.empty+" not empty"+!data.empty);
      // console.log(" valid "+data.valid+" not valid"+!data.valid);
      // // console.log(test);
     
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
  }, []);
  //..............................Admin Functions..........................................
  const name=sessionStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem('mySessionData')
      // const val2=localStorage.getItem('login')
      // console.log("inadd"+log)
      // console.log("session data"+localStorage.getItem('mySessionData'));
      // setIsuserLogged(val2);
      // console.log("inside the app.js sessionvakue :", storedData);
      // console.log("inside the app.js val2 :", val2);
      // console.log("inside the app.js Logged 2:", isLogged);
          
    
  };
  fetchData();
  
}, []);
  
  //..............................User Functions..........................................
  const username = sessionStorage.getItem('username');
  const userid =sessionStorage.getItem('id');
  // console.log('Retrieved username:', username);
  // console.log('Retrieved username:', name);
  const [all, setall] = useState(null);
  const [getall, setGetall] = useState(null);
  const [GetUser,setGetUser] = useState(null)
  const [videos, setVideos] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [getuser,setgetuser] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/v2/video/getall`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setall(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }, []);


  useEffect(() => {
    fetch(`${API_URL}/api/v2/video/getall`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Get the last 3 videos from the list
        const lastThreeVideos = data.slice(-3);
  
        setVideos(lastThreeVideos);
  
        // Fetch thumbnails for the last 3 videos
        lastThreeVideos.forEach(video => {
          fetch(`${API_URL}/api/v2/videoimage/${video.id}`)
            .then(response => response.json())
            .then(data => {
              setThumbnails(prevState => ({
                ...prevState,
                [video.id]: `data:image/png;base64,${data.videoThumbnail}`,
              }));
            })
            .catch(error => {console.error('Error fetching video images:', error);throw error;});
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }, []);
  


  

  const paidVideos = all?.filter(video => video.paid === true) || [];

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAll`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetall(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }, []);

  const paidAudios = getall?.filter(audio => audio.paid === true) || [];

   useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllUsers`)
    .then(response =>{
      if (!response.ok){
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data =>{
      setGetUser(data);
    })
    .catch(error =>{
      console.error('Error fetching data:',error)
      throw error;
    });
   },[]);


   useEffect(() => {
    fetch(`${API_URL}/api/v2/registereduserget`)
    .then(response =>{
      if (!response.ok){
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data =>{
      setgetuser(data);
    })
    .catch(error =>{
      console.error('Error fetching data:',error)
      throw error;
    });
   },[]);

   const getTimeAgo = (userDate) => {
    const currentDate = new Date();
    const givenDate = new Date(userDate);
    
    // Get the time difference in days between the current date and the given date
    const timeDiff = Math.floor((currentDate - givenDate) / (1000 * 60 * 60 * 24));
  
    if (timeDiff === 0) {
      return 'Today';  // Same date as today
    } else if (timeDiff === 1) {
      return 'Yesterday';  // Date was yesterday
    } else {
      // Return actual date in "D/M/YYYY" format
      return `${givenDate.getDate()}/${givenDate.getMonth() + 1}/${givenDate.getFullYear()}`;
    }
  };
  
  

  // const [videothumbnail,setvideothumbnail] = useState(null);

  //  useEffect(() => {
  //   fetch(`${API_URL}/api/v2/videoimage/{id}`)
  //   .then(response =>{
  //     if (!response.ok){
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  //   })
  //   .then(data =>{
  //     setvideothumbnail(data);
  //     console.log("videothumbnail",data)
  //   })
  //   .catch(error =>{
  //     console.error('Error fetching data:',error)
  //   });
  //  },[]);


  return (
    // <div className="container-fluid">
  <div>
      <div className="marquee-content">
        {/* Your scrolling content goes here */}
        {!isvalid?<a
         href="/admin/About_us" style={{color:"darkred"}}>
          License has been expired Need to uploard new License or contact "111111111111"
        </a>:<div></div>}
      </div>
  <br/>  
   

      <div class="dashboard-content">
    <div class="stats-cards">
    <div className="carddashboard">
    <h4>Total Users</h4>
    <div className="icon-text">
        <img src={usericon} alt="usericon" />
        <span>{GetUser && GetUser.length > 0 ? GetUser.length : 0}</span>
    </div>
    <a href="/admin/SubscriptionPayments" className="get-more-link">
        Get more
        <img src={arrow} alt="icon" className="arrow-icon"/>
    </a>
</div>



<div className="carddashboard">
    <h4>Total Videos</h4>
    <div className="icon-text">
        <img src={videoicon} alt="icon" />
        <span>{all && all.length > 0 ? all.length:0}</span>
    </div>
    <a href="/admin/Video" className="get-more-link">
        Get more
        <img src={arrow} alt="icon" className="arrow-icon"/>
    </a>
</div>
<div className="carddashboard">
    <h4>Total Audios</h4>
    <div className="icon-text">
        <img src={music} alt="icon" />
        <span>{getall && getall.length > 0 ? getall.length:0}</span>
    </div>
    <a href="/admin/ListAudio" className="get-more-link">
        Get more
        <img src={arrow} alt="icon" className="arrow-icon"/>
    </a>
</div>
<div className="carddashboard">
    <h4>No of Accounts</h4>
    <div className="icon-text">
        <img src={coin} alt="icon" />
        <span>{GetUser && GetUser.length > 0 ? GetUser.length:0}</span>
    </div>
    <a href="/admin/SubscriptionPayments" className="get-more-link">
        Get more
        <img src={arrow} alt="icon" className="arrow-icon"/>
    </a>
</div>
    </div>
    <div class="latest-sections">

    <div className="latest-users">
    <h4>Latest users <span>Last 15 Days</span></h4>
    <div className="users-list">
    {getuser.length === 0 ? (
        <p>No users found.</p>
    ) : (getuser.map(user => (
            <div key={user.id} className="user-container">
                <div className="user-icon">
                    <i className="fas fa-user"></i> {/* Person icon */}
                </div>
                <div className="user-info">
                    <span className="username">{user.username}</span> {/* Username */}
                    <span className="time-ago">{getTimeAgo(user.date)}</span> {/* Time */}
                </div>
            </div>
        ))
      )}
    </div>
</div>



         <div className="latest-videos">
      <h4>Latest Videos</h4>
      {videos.map(video => (
        <div key={video.id} className="video">
          <img src={thumbnails[video.id]} alt={video.title} 
          style={{width:"20%"}}/>
          <p><span style={{color:'white'}}>{video.videoTitle}</span> <span>{video.mainVideoDuration}</span></p>
        </div>
      ))}
    </div>
    </div>
</div>

    
    </div>
    
   
  
    
  );
};

export default Dashboard;