
import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import API_URL from '../../Config';
import axios from 'axios';
import leftarrowIcon from '../UserIcon/left slide icon.png';
import rightarrowIcon from '../UserIcon/right slide icon.png';
import ManualSlider from './ManualSlider';
import AutoSlider from './AutoSlider';

const AudioHomescreen = () => {
    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [videoBanners, setVideoBanners] = useState([]); // State to store banner data
    const [currentIndexBanner, setCurrentIndexBanner] = useState(0); // Track the current banner index
    const [loading, setLoading] = useState(true); // Add loading state
    const delay = 3000; // Set the delay to 3 seconds
  
    // Fetch data only once on mount
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true); // Set loading before fetching data
        try {
          const response = await fetch(`${API_URL}/api/v2/audioContainerDetails`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setMovies(data);
          setCategories(data);
          setVideoBanners(data[0]?.audiolist || []); // Safe access
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Set loading to false once data is fetched
        }
      };
  
      fetchData();
    }, [API_URL]);
  
    // Automatically update the banner index every 3 seconds
    useEffect(() => {
      if (videoBanners.length > 0) {
        const interval = setInterval(() => {
          setCurrentIndexBanner((prevIndex) => (prevIndex + 1) % videoBanners.length);
        }, delay);
  
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
      }
    }, [videoBanners]);
  
    if (loading) {
      return <div>Loading...</div>; // Show loading state
    }
  
    if (videoBanners.length === 0) {
      return <div>No banners available</div>; // No banners available
    }
  
    const currentBanner = videoBanners[currentIndexBanner]; // Current banner data
  
    return (
      <Layout>
        <div>
          <div className="slider-container" style={{ marginBottom: '30px' }}>
            <div className="slider-track" style={{ display: 'flex', overflow: 'hidden' }}>
              <div className="slider-content" style={{ transition: 'transform 0.5s ease-in-out' }}>
                <div className="movie-card" style={{ width: '100%', textAlign: 'center' }}>
                  <img
                    src={`${API_URL}/api/v2/image/${currentBanner.id}`} // Use currentBanner here
                    alt={currentBanner.movieName || 'Movie'}
                    style={{ width: '90vw', height: '80vh', loading: 'lazy' }} // Lazy loading
                  />
                  <h3>{currentBanner.audio_title}</h3>
                  <p>{currentBanner.certificate_name}</p>
                </div>
              </div>
            </div>
          </div>
  
          {categories.length > 0 && categories.map((category, index) => (
            category.audiolist.length > 0 && ( // Only render the slider if audiolist is not empty
              <div key={index}>
                <h2 className='custom-label' style={{ paddingLeft: '20px', fontSize: '30px', margin: '0px' }}>{category.category_name}</h2>
                <div className='row' style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  <ManualSlider category={category} API_URL={API_URL} /> {/* Pass each category to the slider */}
                </div>
              </div>
            )
          ))}
        </div>
      </Layout>
    );
  };
  


export default AudioHomescreen;


// const goNext = () => {
//   if (currentIndex < totalSlides - slidesToShow) {
//     setCurrentIndex(currentIndex + 1);
//   }
// };

// // Move to the previous slide
// const goPrev = () => {
//   if (currentIndex > 0) {
//     setCurrentIndex(currentIndex - 1);
//   }
// };
// const totalSlides = category.audiolist.length;
// const slidesToShow = 6; // Show 6 images at a time
  // Slider settings for react-slicke for the slider

  // const sliderRef = useRef(null); // Create a reference for the slider

  // const settings = {
  //   dots: true,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 6, // Show 6 images at a time
  //   slidesToScroll: 1,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 3,
  //       }
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 2,
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 1,
  //       }
  //     }
  //   ]
  // };

  // // Move slider forward
  // const goNext = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickNext(); // Move to the next slide
  //   }
  // };

  // // Move slider backward
  // const goPrev = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickPrev(); // Move to the previous slide
  //   }
  // };


// const settings = {
//   dots: true,       // Enable pagination dots
//   infinite: true,   // Enable infinite loop scrolling
//   speed: 500,       // Transition speed
//   slidesToShow: 6,  // Number of images to show at once
//   slidesToScroll: 1 // Scroll 1 image at a time
// };
  {/* <Slider {...settings}>
    {movies.slice(0, movies.length).map(movie => (
      <div key={movie.id} className="movie-card">
        <img src={`${API_URL}/api/v2/image/${movie.id}`} alt={movie.movieName} style={{ width: '100%', height: 'auto' }} />
        <h3>{movie.movieName}</h3>
        <p>{movie.cate}</p>
      </div>
    ))}
  </Slider> */}
  {/* <Slider {...settings}>
{category.audiolist.map(movie => (
<div key={movie.id} className="image-slide">
  <img src={`${API_URL}/api/v2/image/${movie.id}`} alt={movie.movieName} style={{ width: '100%', height: 'auto' }} />
  <h3>{movie.audio_title}</h3>
  <p>{movie.certificate_name}</p>
</div>
))}
</Slider> */}

