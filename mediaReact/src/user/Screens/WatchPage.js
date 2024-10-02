import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { FaCloudDownloadAlt, FaHeart, FaPlay, FaUserFriends } from 'react-icons/fa';
import API_URL from '../../Config';
import axios from 'axios';
import Titles from '../Components/Titles';

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

  const getItemsFromLocalStorage = () => {
    const items = localStorage.getItem('items');
    
    // Parse the JSON string back to an object
    return items ? JSON.parse(items) : null;
  };
  
  // Example of using the retrieved items
  const storedItem = getItemsFromLocalStorage();
  const id = storedItem.id
  const categoryid = storedItem.categoryid;
  if (storedItem) {
    console.log('ID:', storedItem.id);
    console.log('Category ID:', storedItem.categoryid);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch video details
        const response = await axios.get(`${API_URL}/api/v2/GetvideoDetail/${id}`);
        const videoData = response.data;
        setgetall(videoData);
        console.log(videoData);
  
        // Fetch the category names by IDs, if categorylist is available
        if (videoData.categorylist && videoData.categorylist.length > 0) {
          const categoryIds = videoData.categorylist.join(','); 
          const categoryResponse = await fetch(`${API_URL}/api/v2/categorylist/category?categoryIds=${categoryIds}`);
          const categoryNames = await categoryResponse.json();
          console.log('Category Names:', categoryNames);
          setcategoriesvaluelist(categoryNames);
        }

        if (videoData.castandcrewlist && videoData.castandcrewlist.length > 0) {
          const castIds = videoData.castandcrewlist.join(','); // Convert list to comma-separated string
          const castresponse = await fetch(`${API_URL}/api/v2/getcastids?ids=${castIds}`); // Make sure 'ids' is used, not 'castIds'
          
          if (castresponse.ok) {
            const castNames = await castresponse.json();
            console.log('castNames', castNames);
            setcastandcrewlist(castNames); // Assuming this is where you set the fetched data in the state
          } else {
            console.error('Error fetching cast names:', castresponse.statusText);
          }
        }

        
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
  }, [id, userid]);

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

  const handleEdit = (id, name) => {
    console.log(`Editing movie: ${id} - ${name}`);
  };

  const handlePlayClick = () => {
    handleEdit(getall.id, getall.moviename);
    setPlay(true);
    if (log === "true") {
      navigate("/play");
    } else {
      navigate("/UserLogin");
    }
  };

  const handleSubscribe = () => {
    navigate('/PlanDetails');
  };

  return (
  //   <Layout className="container mx-auto min-h-screen overflow-y-auto">
  //     <div className='p-1 mb-5'>
  //       <div className="flex-btn flex-wrap mb-6 gap-2 bg-main rounded border border-gray-800 p-6">
  //         <Link
  //           to={`/`}
  //           className='md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray'
  //           style={{ color: "#FBC740" }}
  //         >
  //           <BiArrowBack /> {getall.moviename}
  //         </Link>
  //         <div className='flex-btn sm:w-auto w-full gap-5'>
  //           <p className='md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray' style={{ color: "#FBC740" }}>
  //             {getall.year} {getall.category}
  //           </p>
  //           <button className='hover:text-subMain'>
  //             <FaHeart />
  //           </button>
  //         </div>
  //         {modeofvideo ? subscribed ? (
  //           <div className='w-full h-screen rounded-lg overflow-hidden relative'>
  //             <div className='absolute top-0 left-0 bottom-0 right-0 bg-main bg-opacity-30 flex-colo'>
  //               <button onClick={handlePlayClick} className='bg-white text-subMain flex-colo border border-subMain rounded-full w-20 h-20 font-medium text-xl'>
  //                 <FaPlay />
  //               </button>
  //             </div>
  //             <img
  //               // src={`data:image/png;base64,${Thumbnail}`}
  //               src={Thumbnail}
  //               alt={getall.moviename}
  //               className='w-full h-full object-cover'
  //             />
  //           </div>
  //         ) : (
  //           <div className='w-full h-screen rounded-lg overflow-hidden relative flex flex-col justify-center items-center'>
  //             <img
  //               // src={`data:image/png;base64,${Thumbnail}`}
  //               src={Thumbnail}
  //               alt={getall.moviename}
  //               className='w-full h-full object-cover'
  //             />
  //             <div className='absolute bottom-0 right-0 left-0 p-80 flex flex-col justify-end items-center  gap-4'>
  //               <button onClick={handleSubscribe} className="bg-subMain hover:text-main transition duration-300 text-white px-2 py-3 rounded font-medium sm:text-sm text-xs inline-flex items-center" style={{ width: '15%', justifyContent: 'center' }}>
  //                 Subscribe
  //               </button>
  //             </div>
  //           </div>
  //         ) : (
  //           <div className='w-full h-screen rounded-lg overflow-hidden relative'>
  //             <div className='absolute top-0 left-0 bottom-0 right-0 bg-main bg-opacity-30 flex-colo'>
  //               <button onClick={handlePlayClick} className='bg-white text-subMain flex-colo border border-subMain rounded-full w-20 h-20 font-medium text-xl'>
  //                 <FaPlay />
  //               </button>
  //             </div>
  //             <img
  //               // src={`data:image/png;base64,${Thumbnail}`}
  //               src={Thumbnail}
  //               alt={getall.moviename}
  //               className='w-full h-full object-cover'
  //             />
  //           </div>
  //         )}
  //       </div>
  //       <p className='md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray' style={{ marginTop: '30px', color: "#FBC740", fontSize: '30px' }}>
  //         Movie Description
  //       </p>
  //       <p className='md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray' style={{ margin: '30px 0 10px 40px', fontSize: '20px' }}>
  //         {getall.description}
  //       </p>
  //     </div>
  //     {/* <div> */}
  //       <Titles title="Cast And Crew" Icon={FaUserFriends} />
  //       <div>
  //       <div>
  //   {base64.length > 0 ? (
  //     <div className="flex flex-wrap gap-4" style={{ marginTop: '20px' }}>
  //       {base64.map((image, index) => (
  //         <div key={index} className="flex flex-col items-center gap-2">
  //           <img
  //             src={`data:image/png;base64,${image}`}
  //             className="h-24 w-24 rounded-full object-cover"
  //             alt={`Thumbnail ${index}`}
  //           />
  //           <span style={{ color: '#FBC740' }}>{videocast.find(item => item.castAndCrewImage === image)?.castAndCrew?.name}</span>
  //         </div>
  //       ))}
  //     </div>
  //   ) : (
  //     <p>Loading cast and crew...</p>
  //   )}
  //   {error && <p>Error: {error}</p>}
  // </div>
  //     </div>
  //   </Layout>

  
  <Layout>
     <div className="videothumbnail position-relative">
    <>
      <img src={`${API_URL}/api/v2/${id}/videothumbnail`} alt="image" className="img-fluid" />
      <div className="overlay-buttons">
        <button id="button1" className="me-4">Subscription</button>
        <button id="button2" className=" me-4">Add to Watch list</button>
        <i className="bi bi-share-fill share-icon"></i>
      </div>
      <span className="overlay-span">Duration:&nbsp;{getall.mainVideoDuration}</span>
    </>
 
</div>

<div className='content'>
  <div className='title'>
  <span >{getall.videoTitle}</span>
  </div>
  <div style={{marginTop:'30px'}}>
  {categoriesvaluelist && categoriesvaluelist.length > 0 && (
  <span >{categoriesvaluelist.join('/')}</span>
 
)}
 </div>
 <div className='castandcrew'>
 <span>Cast & Crew</span>
 {castandcrewlist && castandcrewlist.length > 0 && (
  <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
    {castandcrewlist.map(cast => (
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

 <div className='suggestion'>
  <span>Suggestion</span>
 </div>
</div>

  </Layout>
  );
};

export default WatchPage;
