import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Link, useParams } from 'react-router-dom';
import { Movies } from '../Data/MovieData';
import { BiArrowBack } from 'react-icons/bi';
import { FaCloudDownloadAlt, FaHeart, FaPlay } from 'react-icons/fa';
import API_URL from '../../Config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WatchPage = () => {
    const id = localStorage.getItem('items');
  const [getall,setgetall] = useState('');
  const [Thumbnail,setThumbnail] = useState('');
  const [play, setPlay] = useState(false);
  const navigate = useNavigate();
  const log=localStorage.getItem('login');
  const jwtToken = sessionStorage.getItem("token");
  const userid = (sessionStorage.getItem("userId")); // Convert to number
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ expiryDate , setexpiryDate] = useState('');
  const [currentDate,setcurrentdate] = useState('');



  const subscribed = expiryDate > currentDate;
  const modeofvideo = getall.paid;

  console.log("modeogvideo",modeofvideo)
  console.log("userid",userid)
  console.log("id",id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/GetvideoDetail/${id}`);
        setgetall(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    const fetchThumbnail = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/GetThumbnailsById/${id}`);
        if (response.data) {
          setThumbnail(response.data);
        }
      } catch (error) {
        console.error('Error fetching thumbnail:', error);
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
          setcurrentdate(new Date())
        }
        console.log(data)
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message);
      }
    };

    fetchData();
    fetchThumbnail();
    fetchUser();
  }, [id]);


  const handleEdit = (id, name) => {
    // Your handleEdit logic here
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
  navigate('/PlanDetails')
}



  

    return (
        <Layout  className="container mx-auto min-h-screen   overflow-y-auto" >
        {/* <div className="container mx-auto Dbg-dry p-4 mb-12"> */}
        <div className='p-1 mb-5'>
            <div className="flex-btn flex-wrap mb-6 gap-2 bg-main rounded border border-gray-800 p-6">
                <Link 
                to={`/`} 
                className='md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray'>
                    <BiArrowBack /> {getall.moviename}
                </Link>
                <div className='flex-btn sm:w-auto w-full gap-5'>
                <p className='md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray'>
                   {getall.year} {getall.category}
                    </p>
                    <button className='hover:text-subMain'>
                        <FaHeart />
                    </button>
                </div>
           
                {
  modeofvideo ? subscribed ?
      <div className='w-full h-screen rounded-lg overflow-hidden relative'>
      <div className='absolute top-0 left-0 bottom-0 right-0 bg-main bg-opacity-30 flex-colo'>
        <button onClick={handlePlayClick} className='bg-white text-subMain flex-colo border border-subMain rounded-full w-20 h-20 font-medium text-xl'>
          <FaPlay />
        </button>
      </div>
      <img
        src={`data:image/png;base64,${Thumbnail}`}
        alt={getall.moviename}
        className='w-full h-full object-cover'
      />
    </div>
    :
    <div className='w-full h-screen rounded-lg overflow-hidden relative flex flex-col justify-center items-center'>
  <img
    src={`data:image/png;base64,${Thumbnail}`}
    alt={getall.moviename}
    className='w-full h-full object-cover'
  />
  <div className='absolute bottom-0 right-0 left-0 p-80 flex flex-col justify-end items-center gap-4'>
  <button  onClick={handleSubscribe} className="bg-subMain hover:text-main transition duration-300 text-white px-2 py-3 rounded font-medium sm:text-sm text-xs inline-flex items-center" style={{ width: '15%',justifyContent:'center' }}>
    Subscribe
  </button>
</div>
</div>
  :
  <div className='w-full h-screen rounded-lg overflow-hidden relative'>
    <div className='absolute top-0 left-0 bottom-0 right-0 bg-main bg-opacity-30 flex-colo'>
        <button onClick={handlePlayClick} className='bg-white text-subMain flex-colo border border-subMain rounded-full w-20 h-20 font-medium text-xl'>
          <FaPlay />
        </button>
      </div>
      <img
        src={`data:image/png;base64,${Thumbnail}`}
        alt={getall.moviename}
        className='w-full h-full object-cover'
      />
    </div>
}
        </div>
        </div>
    </Layout>
    )
  
}

export default WatchPage