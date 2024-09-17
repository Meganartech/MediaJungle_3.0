import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Head from '../Components/Head';
import Filters from '../Components/Filters';
import API_URL from '../../Config';

const MoviesPage = () => {
  const maxPage = 5;
  const log = localStorage.getItem('login');
  const [page, setPage] = useState(maxPage);
  const [vimage, setvImage] = useState([]);
  const [all, setall] = useState(null);
  const [images, setImages] = useState({}); // Store images with video IDs as keys
  const userid = sessionStorage.getItem('userId');
  const [videoContainer,setVideoContainer] = useState([]);

  const HandleLoadingMore = () => {
    setPage(page + maxPage);
  };

  // useEffect(() => {
  //   fetch(`${API_URL}/api/v2/video/getall`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setall(data);
  //       console.log("Fetched Data:", data);
  //       const id = data.id;
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });

  //   fetchData();
  // }, []);


  useEffect(() => {
    // Fetch video data
    fetch(`${API_URL}/api/v2/video/getall`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setall(data);
        console.log("Fetched Data:", data);

        // Fetch images for each video
        data.forEach(video => {
          const id = video.id;

          // Fetch the image using the video id
          fetch(`${API_URL}/api/v2/${id}/videothumbnail`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json(); // Fetch the image as JSON
            })
            .then(data => {
              // Assuming the response data has the image base64 string under 'videoThumbnail'
              const imageBase64 = data.videoThumbnail;
              const imageUrl = `data:image/png;base64,${imageBase64}`;

              // Update the state with the image URL for the specific video ID
              setImages(prevImages => ({
                ...prevImages,
                [id]: imageUrl
              }));

              console.log("Fetched Image URL for ID", id, ":", imageUrl);
            })
            .catch(error => {
              console.error('Error fetching image:', error);
            });
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    fetch(`${API_URL}/api/v2/getvideocontainer`)
      .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
      .then(data => setVideoContainer(data))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log(videoContainer)

  const handlEdit = async (Id) => {
    localStorage.setItem('items', Id);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v2/GetvideoThumbnail`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data)) {
        setvImage(data);
      } else {
        console.error('Invalid or empty data received:', data);
      }
    } catch (error) {
      console.error('Error fetching or processing image data:', error);
    }
  };

  return (
    <Layout>
      <div
        className='mx-auto min-h-screen px-10'
        style={{
          background: 'linear-gradient(to bottom, #141335, #0c0d1a)', // Gradient background applied here
        }}
      >
        <div className="px-2 mb-6">
          <Filters />
          
          <p className='text-lg font-medium'>
            Total <span className='font-bold text-subMain'>{all && all.length > 0 ? all.length : "none"}</span> items Found
          </p>

          <div
            className='grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6'
            style={{ height: "auto !important" }}
          >
            {all && all.length > 0 ? (
              all.map((video) => (
                <div key={video.id} className="slider-item">
                  <div className='border border-border p-1 hover:scale-95 transitions relative rounded overflow-hidden' style={{ height: "16rem" }}>
                    <Link to={userid ? `/watchpage/${video.videoTitle}` : "/UserLogin"} onClick={() => handlEdit(video.id)} className='w-full'>
                    {images[video.id] &&  
            <img 
              src={images[video.id]}
              alt={`Image for ${video.videoTitle}`} 

                        className='w-full h-64 object-cover'
                      />
                    }
                    </Link>
                    <div className='absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3'>
                      <h3 className='font-semibold truncate'>{video.videoTitle}</h3>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </Layout>

  //   <Layout>
  //   <div
  //     className='container-fluid min-vh-100 px-3'
  //     style={{
  //       background: 'linear-gradient(to bottom, #141335, #0c0d1a)', // Gradient background applied here
  //     }}
  //   >
  //     <div className="mb-4">
        
        
  //       <p className='fs-4 fw-medium'>
  //         Total <span className='fw-bold text-primary'>{all && all.length > 0 ? all.length : "none"}</span> items Found
  //       </p>

  //       <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-4'>
  //         {all && all.length > 0 ? (
  //           all.map((video) => (
  //             <div key={video.id} className="col">
  //               <div className='card border border-light rounded overflow-hidden shadow-sm h-100'>
  //                 <Link to={userid ? `/watchpage/${video.videoTitle}` : "/UserLogin"} onClick={() => handlEdit(video.id)} className='text-decoration-none'>
  //                 {images[video.id] &&  
  //           <img 
  //             src={images[video.id]}
  //             alt={`Image for ${video.videoTitle}`} 
  //                     className='card-img-top'
  //                   />
  //                 }
  //                 </Link>
  //                 <div className='card-img-overlay d-flex align-items-end bg-dark bg-opacity-50 text-white'>
  //                   <h3 className='card-title fw-semibold text-truncate'>{video.videoTitle}</h3>
  //                 </div>
  //               </div>
  //             </div>
  //           ))
  //         ) : (
  //           <div className='text-center w-100'>
  //             <p>No items found</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // </Layout>
  );
};

export default MoviesPage;
