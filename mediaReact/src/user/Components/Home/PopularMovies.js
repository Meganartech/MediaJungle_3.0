import React, { useEffect, useState } from 'react';
import Titles from '../Titles';
import { BsCollectionFill } from 'react-icons/bs';
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import Movie from '../Movie';
import { Movies } from '../../Data/MovieData';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../index.css';

const PopularMovies = () => {
  const log=localStorage.getItem('login');
  const [all, setall] = useState(null);
  const [vimage, setvImage] = useState([]);
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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className='my-10 mx-8'>
      <Titles title="Popular Movies" Icon={BsCollectionFill} />
      <br />
      <div className="slider-container" >
        
        <Slider {...sliderSettings}>
        
          {all && all.length > 0 ? (all.slice(0, all.length).map((movie, index) => (
            <div key={index} className="slider-item">
             <div className='border border-border p-1 hover:scale-95 transitions relative rounded overflow-hidden' style={{height: "16rem"}}>
      <Link to={log==="true"?"/play":"/UserLogin"} className='w-full' onClick={() => handlEdit(movie.id)} >
        <img 
        src={`data:image/png;base64,${vimage[index]}`}
        alt={movie?.name} 
        className='w-full h-64 object-cover' 
        />
      </Link>
      <div className='absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3'>
        <h3 className='font-semibold truncate'>{movie.moviename}</h3>
      </div>
    </div>
            </div>
          ))):( <div></div>)}
        </Slider>
      </div>
    </div>
  );
};

export default PopularMovies;
