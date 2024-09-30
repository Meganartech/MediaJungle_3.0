// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Layout from '../Layout/Layout';
// import Head from '../Components/Head';
// import Filters from '../Components/Filters';
// import API_URL from '../../Config';

// const MoviesPage = () => {
//   const maxPage = 5;
//   const log = localStorage.getItem('login');
//   const [page, setPage] = useState(maxPage);
//   const [vimage, setvImage] = useState([]);
//   const [all, setall] = useState(null);
//   const [images, setImages] = useState({}); // Store images with video IDs as keys
//   const userid = sessionStorage.getItem('userId');
//   const [videoContainer,setVideoContainer] = useState([]);

//   const HandleLoadingMore = () => {
//     setPage(page + maxPage);
//   };

//   // useEffect(() => {
//   //   fetch(`${API_URL}/api/v2/video/getall`)
//   //     .then(response => {
//   //       if (!response.ok) {
//   //         throw new Error('Network response was not ok');
//   //       }
//   //       return response.json();
//   //     })
//   //     .then(data => {
//   //       setall(data);
//   //       console.log("Fetched Data:", data);
//   //       const id = data.id;
//   //     })
//   //     .catch(error => {
//   //       console.error('Error fetching data:', error);
//   //     });

//   //   fetchData();
//   // }, []);


//   useEffect(() => {
//     // Fetch video data
//     fetch(`${API_URL}/api/v2/video/getall`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setall(data);
//         console.log("Fetched Data:", data);

//         // Fetch images for each video
//         data.forEach(video => {
//           const id = video.id;

//           // Fetch the image using the video id
//           fetch(`${API_URL}/api/v2/${id}/videothumbnail`)
//             .then(response => {
//               if (!response.ok) {
//                 throw new Error('Network response was not ok');
//               }
//               return response.json(); // Fetch the image as JSON
//             })
//             .then(data => {
//               // Assuming the response data has the image base64 string under 'videoThumbnail'
//               const imageBase64 = data.videoThumbnail;
//               const imageUrl = `data:image/png;base64,${imageBase64}`;

//               // Update the state with the image URL for the specific video ID
//               setImages(prevImages => ({
//                 ...prevImages,
//                 [id]: imageUrl
//               }));

//               console.log("Fetched Image URL for ID", id, ":", imageUrl);
//             })
//             .catch(error => {
//               console.error('Error fetching image:', error);
//             });
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);


//   useEffect(() => {
//     fetch(`${API_URL}/api/v2/getvideocontainer`)
//       .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
//       .then(data => setVideoContainer(data))
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   console.log(videoContainer)

//   const handlEdit = async (Id) => {
//     localStorage.setItem('items', Id);
//   };

//   const fetchData = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/v2/GetvideoThumbnail`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data && Array.isArray(data)) {
//         setvImage(data);
//       } else {
//         console.error('Invalid or empty data received:', data);
//       }
//     } catch (error) {
//       console.error('Error fetching or processing image data:', error);
//     }
//   };

//   return (
//     <Layout>
//       <div
//         className='mx-auto min-h-screen px-10'
//         style={{
//           background: 'linear-gradient(to bottom, #141335, #0c0d1a)', // Gradient background applied here
//         }}
//       >
//         <div className="px-2 mb-6">
//           <Filters />
          
//           <p className='text-lg font-medium'>
//             Total <span className='font-bold text-subMain'>{all && all.length > 0 ? all.length : "none"}</span> items Found
//           </p>

//           <div
//             className='grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6'
//             style={{ height: "auto !important" }}
//           >
//             {all && all.length > 0 ? (
//               all.map((video) => (
//                 <div key={video.id} className="slider-item">
//                   <div className='border border-border p-1 hover:scale-95 transitions relative rounded overflow-hidden' style={{ height: "16rem" }}>
//                     <Link to={userid ? `/watchpage/${video.videoTitle}` : "/UserLogin"} onClick={() => handlEdit(video.id)} className='w-full'>
//                     {images[video.id] &&  
//             <img 
//               src={images[video.id]}
//               alt={`Image for ${video.videoTitle}`} 

//                         className='w-full h-64 object-cover'
//                       />
//                     }
//                     </Link>
//                     <div className='absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3'>
//                       <h3 className='font-semibold truncate'>{video.videoTitle}</h3>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div></div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>

//   //   <Layout>
//   //   <div
//   //     className='container-fluid min-vh-100 px-3'
//   //     style={{
//   //       background: 'linear-gradient(to bottom, #141335, #0c0d1a)', // Gradient background applied here
//   //     }}
//   //   >
//   //     <div className="mb-4">
        
        
//   //       <p className='fs-4 fw-medium'>
//   //         Total <span className='fw-bold text-primary'>{all && all.length > 0 ? all.length : "none"}</span> items Found
//   //       </p>

//   //       <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-4'>
//   //         {all && all.length > 0 ? (
//   //           all.map((video) => (
//   //             <div key={video.id} className="col">
//   //               <div className='card border border-light rounded overflow-hidden shadow-sm h-100'>
//   //                 <Link to={userid ? `/watchpage/${video.videoTitle}` : "/UserLogin"} onClick={() => handlEdit(video.id)} className='text-decoration-none'>
//   //                 {images[video.id] &&  
//   //           <img 
//   //             src={images[video.id]}
//   //             alt={`Image for ${video.videoTitle}`} 
//   //                     className='card-img-top'
//   //                   />
//   //                 }
//   //                 </Link>
//   //                 <div className='card-img-overlay d-flex align-items-end bg-dark bg-opacity-50 text-white'>
//   //                   <h3 className='card-title fw-semibold text-truncate'>{video.videoTitle}</h3>
//   //                 </div>
//   //               </div>
//   //             </div>
//   //           ))
//   //         ) : (
//   //           <div className='text-center w-100'>
//   //             <p>No items found</p>
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //   </div>
//   // </Layout>
//   );
// };

// export default MoviesPage;

// import React, { useState, useEffect } from 'react';
// import Layout from '../Layout/Layout';
// import API_URL from '../../Config';
// import axios from 'axios'; // Assuming you are using axios for API calls
// import leftarrowIcon from '../UserIcon/left slide icon.png';
// import rightarrowIcon from '../UserIcon/right slide icon.png';

// const MoviesPage = () => {
//   const [states, setStates] = useState([]); // Holds the categories and their data
//   const [videoIds, setVideoIds] = useState([]); // Holds the category-wise image data
//   const [all, setAll] = useState([]); // Holds all video data
//   const [images, setImages] = useState({}); // Holds images with videoId as key
//   const [currentIndex, setCurrentIndex] = useState({}); // Track the current index for each category
//   const [videoBanners, setVideoBanners] = useState([]); // State to store banner data
//   const [bannerIndex, setBannerIndex] = useState(0); // Track banner index for sliding

//   // Fetch banner data from API
//   const fetchVideoBanners = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v2/getallvideobanners`);
//       setVideoBanners(response.data); // Set fetched banner data to state
//     } catch (error) {
//       console.error('Error fetching video banners:', error);
//     }
//   };

//   useEffect(() => {
//     // Fetch video banners when the component mounts
//     fetchVideoBanners();
//   }, []);

//   // Automatically update the bannerIndex every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBannerIndex((prevIndex) => (prevIndex + 1) % videoBanners.length);
//     }, 3000); // Change slide every 3 seconds

//     return () => clearInterval(interval); // Clear interval on component unmount
//   }, [videoBanners.length]);

//   useEffect(() => {
//     fetch(`${API_URL}/api/v2/getvideocontainer`)
//       .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
//       .then(data => {
//         setStates(data);
//         const fetchPromises = data.map(state => {
//           const categoryId = state.category;
//           return fetch(`${API_URL}/api/v2/images-by-category?categoryId=${categoryId}`)
//             .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch video IDs'))
//             .then(videoIds => ({ categoryId, videoIds }))
//             .catch(error => {
//               console.error('Error fetching video IDs:', error);
//               return { categoryId, videoIds: [] };
//             });
//         });

//         Promise.all(fetchPromises)
//           .then(results => {
//             setVideoIds(results);
//             const initialIndex = {};
//             results.forEach(result => {
//               initialIndex[result.categoryId] = 0; // Initialize index for each category
//             });
//             setCurrentIndex(initialIndex);
//           })
//           .catch(error => {
//             console.error('Error in fetching video IDs:', error);
//           });
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   useEffect(() => {
//     fetch(`${API_URL}/api/v2/video/getall`)
//       .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
//       .then(data => {
//         setAll(data);
//         data.forEach(video => {
//           const id = video.id;
//           fetch(`${API_URL}/api/v2/${id}/videothumbnail`)
//             .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
//             .then(imageData => {
//               const imageBase64 = imageData.videoThumbnail;
//               const imageUrl = `data:image/png;base64,${imageBase64}`;
//               setImages(prevImages => ({
//                 ...prevImages,
//                 [id]: imageUrl
//               }));
//             })
//             .catch(error => {
//               console.error('Error fetching image:', error);
//             });
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });

//   }, []);

//   const handleNext = (categoryId) => {
//     setCurrentIndex(prevIndex => {
//       const newIndex = prevIndex[categoryId] + 1;
//       return { ...prevIndex, [categoryId]: newIndex };
//     });
//   };

//   const handlePrevious = (categoryId) => {
//     setCurrentIndex(prevIndex => {
//       const newIndex = Math.max(0, prevIndex[categoryId] - 1); // Prevent going below 0
//       return { ...prevIndex, [categoryId]: newIndex };
//     });
//   };

//   return (
//     <Layout>
//       {/* Banner Section Displayed at the Top */}
//       <div className="banner-container">
//         {videoBanners.length > 0 && (
//           <div className="banner-items" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
//             {videoBanners.map((banner, index) => {
//               const bannerImageUrl = images[banner.videoId];
//               return (
//                 bannerImageUrl && (
//                   <div key={index} className="banner-item">
//                     <img src={bannerImageUrl} alt={`Banner ${index}`} />
//                   </div>
//                 )
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <div className="container-list">
//         {states.length === 0 ? (
//           <div>No content available</div>
//         ) : (
//           states.map((state) => {
//             const categoryImages =
//               videoIds.find((video) => video.categoryId === state.category)
//                 ?.videoIds || [];
//             const start = currentIndex[state.category] || 0;
//             const displayedImages = categoryImages.slice(start, start + 6);

//             return (
//               <div key={state.id}>
//                 {/* Main Container Section */}
//                 <div className="customcontainer">
//                   <span>{state.value}</span>
//                   <div className="navigation">
//                     {/* Left Button */}
//                     <button
//                       onClick={() => handlePrevious(state.category)}
//                       disabled={start === 0}
//                     >
//                       <img
//                         src={leftarrowIcon} // Replace with your left arrow icon path
//                         alt="left arrow icon"
//                         style={{ width: "30px", height: "30px" }}
//                       />
//                     </button>

//                     <div className="items">
//                       {displayedImages.length === 0 ? (
//                         <div>No images available</div>
//                       ) : (
//                         displayedImages.map((videoId) => {
//                           const imageUrl = images[videoId];
//                           const videoData = all.find(
//                             (video) => video.id === videoId
//                           );
//                           const videoTitle = videoData?.videoTitle;

//                           return (
//                             imageUrl && (
//                               <div key={videoId} className="item">
//                                 <img src={imageUrl} alt={`Video ${videoId}`} />
//                                 <p>{videoTitle}</p>
//                               </div>
//                             )
//                           );
//                         })
//                       )}
//                     </div>

//                     {/* Right Button */}
//                     <button
//                       onClick={() => handleNext(state.category)}
//                       disabled={start + 6 >= categoryImages.length}
//                     >
//                       <img
//                         src={rightarrowIcon} // Replace with your right arrow icon path
//                         alt="right arrow icon"
//                         style={{ width: "30px", height: "30px" }}
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default MoviesPage;


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


  // Fetch video banners (if needed, but not used in your current code)
  const fetchVideoBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/getallvideobanners`);
      // Handle banner data here if necessary
      setVideoBanners(response.data)
    } catch (error) {
      console.error('Error fetching video banners:', error);
    }
  };

  // Fetch video container data
  const fetchVideoContainer = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/getvideocontainer`);
      setStates(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching video container:', error);
    }
  };

  useEffect(() => {
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

  // Navigate to the next set of videos
  const handleNext = (category) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex[category] || 0) + 1;
      return { ...prevIndex, [category]: newIndex };
    });
  };

  // Navigate to the previous set of videos
  const handlePrevious = (category) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(0, (prevIndex[category] || 0) - 1);
      return { ...prevIndex, [category]: newIndex };
    });
  };


  const [play, setPlay] = useState(false); // Define state for play
  const log = localStorage.getItem('login');
  const navigate = useNavigate(); // Define navigate function


  const handleEdit = (id) => {
    localStorage.setItem('items', id);
  };



  const handlePlayClick = (videoid) => {
    handleEdit(videoid);
    setPlay(true);
    if (log === "true") {
      navigate("/play");
    } else {
      navigate("/UserLogin");
    }
  };

  return (
    <Layout>
      {/* Banner Section Displayed at the Top */}
<div className="banner-container">
  {videoBanners.length > 0 && (
    <div className="banner-items" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
      {videoBanners.map((banner, index) => (
        <div key={index} className="banner-item" onClick={() => handlePlayClick(banner.videoId)}  style={{ cursor: 'pointer' }}>
          <img src={`${API_URL}/api/v2/${banner.videoId}/videothumbnail`} alt={`Banner ${index}`} />
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
                    <button
                      onClick={() => handlePrevious(state.value)}
                      disabled={start === 0} // Disable if at the start
                    >
                      <img
                        src={leftarrowIcon}
                        alt="left arrow icon"
                        style={{ width: "30px", height: "30px" }}
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
                                onClick={() => handleEdit(video.id)}
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
                    <button
                      onClick={() => handleNext(state.value)}
                      disabled={start + 6 >= videoDescriptions.length} // Disable if no more videos to display
                    >
                      <img
                        src={rightarrowIcon}
                        alt="right arrow icon"
                        style={{ width: "30px", height: "30px" }}
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





