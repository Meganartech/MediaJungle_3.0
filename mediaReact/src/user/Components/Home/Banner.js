import React,{ useEffect, useState }  from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Movies } from '../../Data/MovieData'
import FlexMovieItems from '../FlexMovieItems';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const Banner = () => {
  const [all, setall] = useState(null);
  const [vimage, setvImage] = useState([]);
  const log=localStorage.getItem('login');
  useEffect(() => {
    // Find the "Previous" arrow and remove its content
    // const prevArrow = document.querySelector('.slick-prev');
    // if (prevArrow) {
    //   prevArrow.innerHTML = ''; // Remove content
    // }

    // const nextArrow = document.querySelector('.slick-next');
    // if (nextArrow) {
    //   nextArrow.innerHTML = ''; // Remove content
    // }
    console.log("1")
    fetchData();


  }, []);
  useEffect(() => {
     
  
    // fetch category data from the backend
    fetch('http://localhost:8080/api/videogetall')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setall(data);
      // console.log(data)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  
    fetchData();
      // fetch('http://localhost:8080/api/GetvideoThumbnail')
      // .then(response => {
      //   if (!response.ok) {
      //     throw new Error('Network response was not ok');
      //   }
      //   return response.json();
      // })
      // .then(data => {
      //   setall(data);
      //   console.log(" in banner"+all);
      // })
      // .catch(error => {
      //   console.error('Error fetching data:', error);
      // });
      
      
      
      fetchData();


  }, []);
  const handlEdit = async (Id) => {
    localStorage.setItem('items', Id);
  };

  
 
  const fetchData = async () => {
      
  
    // ------------------------------------------------------------------------------------
    try {
      // Fetch image data
      const response = await fetch('http://localhost:8080/api/GetvideoThumbnail');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setvImage(data);
        // console.log(data);
      } else {
        console.error('Invalid or empty data received:', data);
      }
    } catch (error) {
      console.error('Error fetching or processing image data:', error);
    }
  }; 
   return (
    <div className='relative w-full xl:h-96 bg-dry lg:h-64 h-48 overflow-hidden'>
      <Swiper
        direction='vertical'
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        speed={1000}
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className='w-full xl:h-96 bg-dry lg:h-64 h-48'
      >
        {
          all && all.length > 0 ? (all.slice(0, 8).map((movie, index) => (
            <SwiperSlide key={index} className='relative rounded overflow-hidden' style={{overflow:"hidden"}}>
              <img src={`data:image/png;base64,${vimage[index]}`} alt={movie.title} className='w-full h-200 object-cover' />
              <div className='absolute linear-bg xl:pl-52 sm:pl-32 pl-8 top-0 bottom-0 right-0 left-0 flex flex-col justify-center lg:gap- md:gap-5 gap-4'>
                <h1 className='xl:text-4xl truncate capitalize font-sans sm:text-2xl text-xl font-bold'>
                  {movie.moviename}
                </h1>
                <div className='flex gap-5 items-center text-dryGray'>
                  <FlexMovieItems movie={movie} />
                </div>
                <div className='flex gap-5 items-center'>
                  <Link
                    to={log==="true"?"/play":"/UserLogin"}
                    onClick={() => handlEdit(movie.id)} 
                    className="bg-subMain hover:text-main transitions text-white px-8 py-3 rounded font-medium sm:text-sm text-xs">
                    Watch
                  </Link>
                  <button className='hover:text-subMain'>
                    <FaHeart />
                  </button>
                </div>
              </div>
            </SwiperSlide>

          ))):(<div></div>)
        }
      </Swiper>
    </div>

  )
}

export default Banner