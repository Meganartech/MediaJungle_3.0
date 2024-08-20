
// // ---------------------------------------------------------------------
// // import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import API_URL from '../Config';
// import "../css/Sidebar.css";

// import "../App.css"
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2'


// import React, { useState, useEffect, useRef } from 'react';

// const AddVideo = () => {
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [categoryId, setCategoryId] = useState('');
//   const [Certificate, setCertificate] = useState([]);
//   const [certificateId, setCertificateId] = useState('');
//   const [Language, setLanguage] = useState([]);
//   const [LanguageId, setLanguageId] = useState('');
//   const [Tag, setTag] = useState([]);
//   const [TagId, setTagId] = useState('');
//   const [thumbnail, setThumbnail] = useState(null);
//   const [selected, setSelected] = useState(false);
//   const [getall,setgetall] = useState(''); 
//   const [Getall,setGetall] = useState('');
//   const navigate = useNavigate();
//   const [selectedOption, setSelectedOption] = useState('free');
//   const [imageUrl, setImageUrl] = useState(null); // To display image preview
//   const token = sessionStorage.getItem("tokenn")

//   const [isOpen, setIsOpen] = useState(false);
//   const [castandcrewlist, setcastandcrewlist] = useState([]);
//   const dropdownRef = useRef(null);

//   const handleClickOutside = event => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setThumbnail(file);

//     // Display image preview
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImageUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setImageUrl(null);
//     }
//   };

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleCheckboxChange = (option) => (e) => {
//     const isChecked = e.target.checked;
//     const id = (option.id); // Convert ID to number
  
//     if (isChecked) {
//       setcastandcrewlist((prevList) => [...prevList, id]);
//     } else {
//       setcastandcrewlist((prevList) => prevList.filter((item) => item !== id));
//     }
//   };


//   useEffect(() => {
//     fetch(`${API_URL}/api/v2/GetAllcastandcrew`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setGetall(data);
//         console.log(data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   useEffect(() => {
//     fetch(`${API_URL}/api/v2/GetAllPlans`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setgetall(data);
//         console.log(data)
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   const handleRadioChange = (e) => {
//     setSelectedOption(e.target.value);
// };

// const handlePaidRadioHover = () => {
//   if (!hasPaymentPlan()) {
//     Swal.fire({
//       title: 'Error!',
//       text: 'You first need to add a payment plan to enable this option.',
//       icon: 'error',
//       showCancelButton: true,
//       confirmButtonText: 'Go to Add plan page',
//       cancelButtonText: 'Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         navigate('/admin/Adminplan');
//       } else if (result.isDismissed) {
//         console.log('Cancel was clicked');
//       }
//     });
//   }
// };


// const hasPaymentPlan = () => {
//      return getall.length > 0;
//     // return false;
// };


//   // const fetchData = async () => {
//     useEffect(() => {
   
    
//     fetch(`${API_URL}/api/v2/GetAllCategories`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setCategories(data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });

//     fetch(`${API_URL}/api/v2/GetAllCertificate`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setCertificate(data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });

//       fetch(`${API_URL}/api/v2/GetAllLanguage`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setLanguage(data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });

//       fetch(`${API_URL}/api/v2/GetAllTag`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setTag(data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });



//     }, []);

//   // fetchData();
//   const [Movie_name, setMovie_name] = useState('');
//   const changeMovie_name = (event) => {
//     const newValue = event.target.value;
//     setMovie_name(newValue); // Updating the state using the setter function
//   };
//   const [Year, setYear] = useState('');
//   const changeYear = (event) => {
//     const newValue = event.target.value;
//     setYear(newValue); // Updating the state using the setter function
//   };
//   const [Duration, setDuration] = useState('');
//   const changeDuration = (event) => {
//     const newValue = event.target.value;
//     setDuration(newValue); // Updating the state using the setter function
//   };
//   const [Description, setDescription] = useState('');
//   const changeDescription = (event) => {
//     const newValue = event.target.value;
//     setDescription(newValue); // Updating the state using the setter function
//   };
//   const [Cast_Crew, setCast_Crew] = useState('');
//   const changeCast_Crew = (event) => {
//     const newValue = event.target.value;
//     setCast_Crew(newValue); // Updating the state using the setter function
//   };

//   const handleFileChange = (event) => {
//     // setThumbnail(event.target.files[0]);
//     // setFile(event.target.files[0]);
//   };
//   const handleFile = (event) => {
//     // setThumbnail(event.target.files[0]);
//     setFile(event.target.files[0]);
//   };

//   const handleRadioClick = () => {
//     setSelected(!selected); // Toggle the value of 'selected'
//   };


//   const Upload = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('video', file);

//       const response = await axios.post(`${API_URL}/api/v2/postit`, formData, {

//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//           setUploadProgress(progress);
//         }
//       });
//       console.log(response.data);

//       console.log('Upload successful!', response.data);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };
  
  

//   // const save = async (e) => {
//   //   e.preventDefault();

//   //   try {
//   //   const formData = new FormData();
//   //   const audioData = {
        
//   //     thumbnail: thumbnail,
//   //   };
//   //   console.log("audioData")
//   //   console.log(audioData)
//   //   const Addvideo = { Movie_name: Movie_name, tags: TagId, description: Description,category: categoryId,certificate: certificateId,Language: LanguageId,Duration:Duration,Year:Year,thumbnail:thumbnail,video:file, paid: selected ? 1 : 0,};
//   //   console.log(Addvideo);


//   //   for (const key in Addvideo) {
//   //     formData.append(key, Addvideo[key]);
//   //   }

//   //   const response = await axios.post(`${API_URL}/api/uploaddescriprion`, formData, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       },
//   //       onUploadProgress: (progressEvent) => {
//   //         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//   //         setUploadProgress(progress);
//   //       }
//   //     });
//   //       console.log(response.data);
//   //     console.log("video updated successfully");
//   //   } catch (error) {
//   //     console.error('Error uploading audio:', error);
//   //     // Handle error, e.g., show an error message to the user
//   //   }
   
//   //   // Employee.setVideo(Addvideo).then(res => {
//   //   //   // handleUpload();
//   //   //   setMovie_name('');
//   //   //   setTags('');
//   //   //   setDescription('');
//   //   // })
//   // }

  
//   // const save = async (e) => {
//   //   e.preventDefault();
  
//   //   try {
//   //     // First fetch request to check the count
//   //     const response = await fetch(`${API_URL}/api/v2/count`, {
//   //       method: 'GET',
//   //     });
  
//   //     console.log(response);
  
//   //     if (response.ok) {
//   //       try {
//   //         // Initialize formData
//   //         const formData = new FormData();
  
//   //         // Define Addvideo object with the necessary data
//   //         const Addvideo = {
//   //           Movie_name: Movie_name,
//   //           tags: TagId,
//   //           description: Description,
//   //           category: categoryId,
//   //           certificate: certificateId,
//   //           Language: LanguageId,
//   //           Duration: Duration,
//   //           Year: Year,
//   //           thumbnail: thumbnail,
//   //           video: file,
//   //           paid: selectedOption === 'paid' ? 1 : 0,
//   //         };
  
//   //         // Append cast and crew list to formData
//   //         castandcrewlist.forEach((id) => {
//   //           formData.append('castandcrewlist', id);
//   //         });
  
//   //         // Append Addvideo properties to formData
//   //         for (const key in Addvideo) {
//   //           formData.append(key, Addvideo[key]);
//   //         }
  
//   //         console.log("Addvideo:");
//   //         console.log(Addvideo);
  
//   //         // Make the POST request to upload description
//   //         const uploadResponse = await axios.post(`${API_URL}/api/uploaddescriprion`, formData, {
//   //           headers: {
//   //             'Content-Type': 'multipart/form-data',
//   //           },
//   //           onUploadProgress: (progressEvent) => {
//   //             const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//   //             setUploadProgress(progress);
//   //           },
//   //         });
  
//   //         console.log(uploadResponse.data);
//   //         console.log("Video updated successfully");
//   //       } catch (error) {
//   //         console.error('Error uploading video:', error);
//   //         // Handle error, e.g., show an error message to the user
//   //       }
//   //     } else {
//   //       alert("Limit reached");
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching count:', error);
//   //   }
//   // };


// //   const save = async (e) => {
// //     e.preventDefault();
// //     try {
// //         const response = await fetch(`${API_URL}/api/v2/count`, {
// //             method: 'GET',
// //         });
// //         console.log(response);
// //         if (response.ok) {
// //             try {
// //                 const formData = new FormData();
// //                 formData.append('moviename', Movie_name);
// //                 formData.append('description', Description);
// //                 formData.append('tags', TagId);
// //                 formData.append('category', categoryId);
// //                 formData.append('certificate', certificateId);
// //                 formData.append('language', LanguageId);
// //                 formData.append('duration', Duration);
// //                 formData.append('year', Year);
// //                 formData.append('thumbnail', thumbnail);
// //                 formData.append('video', file);
// //                 formData.append('paid', selectedOption === 'paid' ? 1 : 0);

// //                 // Correctly append each item in castandcrewlist
// //                 castandcrewlist.forEach((id) => {
// //                   formData.append('castandcrewlist', id);
// //                 });

// //                 const uploadResponse = await axios.post(`${API_URL}/api/uploaddescription`, formData, {
// //                     onUploadProgress: (progressEvent) => {
// //                         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
// //                         setUploadProgress(progress);
// //                     }
// //                 });

// //                 console.log(uploadResponse.data);
// //                 Swal.fire({
// //                     title: 'Success!',
// //                     text: 'Video updated successfully',
// //                     icon: 'success',
// //                     confirmButtonText: 'OK'
// //                 });
// //             } catch (error) {
// //                 console.error('Error uploading video:', error);
// //                 Swal.fire({
// //                     title: 'Error!',
// //                     text: 'Error uploading video',
// //                     icon: 'error',
// //                     confirmButtonText: 'OK'
// //                 });
// //             }
// //         } else {
// //             Swal.fire({
// //                 title: 'Limit Reached',
// //                 text: 'The upload limit has been reached',
// //                 icon: 'warning',
// //                 confirmButtonText: 'OK'
// //             });
// //         }
// //     } catch (error) {
// //         console.error('Error ', error);
// //         Swal.fire({
// //             title: 'Error!',
// //             text: 'An error occurred',
// //             icon: 'error',
// //             confirmButtonText: 'OK'
// //         });
// //     }

// //     console.log("audioData");
// //     const Addvideo = { 
// //         Movie_name, 
// //         tags: TagId, 
// //         description: Description, 
// //         category: categoryId, 
// //         certificate: certificateId, 
// //         language: LanguageId, 
// //         duration: Duration, 
// //         year: Year, 
// //         thumbnail, 
// //         video: file, 
// //         paid: selectedOption === 'paid' ? 1 : 0,
// //         castandcrewlist: castandcrewlist // Add the selectedItems to the object
// //     };

// //     console.log(Addvideo);
// // };


// const save = async (e) => {
//     e.preventDefault();
    
//     try {
//         const response = await fetch(`${API_URL}/api/v2/count`, {
//             method: 'GET',
//         });

//         if (response.ok) {
//             try {
//                 const formData = new FormData();
//                 formData.append('moviename', Movie_name);
//                 formData.append('description', Description);
//                 formData.append('tags', TagId);
//                 formData.append('category', categoryId);
//                 formData.append('certificate', certificateId);
//                 formData.append('language', LanguageId);
//                 formData.append('duration', Duration);
//                 formData.append('year', Year);
//                 formData.append('thumbnail', thumbnail);
//                 formData.append('video', file);
//                 formData.append('paid', selectedOption === 'paid');

//                 // Upload video description
//                 const uploadResponse = await axios.post(`${API_URL}/api/v2/uploaddescription`, formData, {
//                   headers: {
//                     Authorization: token, // Pass the token in the Authorization header
//                    'Content-Type': 'multipart/form-data',
//                  },
//                     onUploadProgress: (progressEvent) => {
//                         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//                         setUploadProgress(progress);
//                     }
//                 });

//                 const videoId = uploadResponse.data.id; // Assuming the response contains the video ID

//                 // Prepare data for the second API call
//                 const castAndCrewData = new FormData();
//                 castAndCrewData.append('videoId', videoId);
//                 castandcrewlist.forEach((id) => {
//                     castAndCrewData.append('castAndCrewIds', id);
//                 });

//                 // Save cast and crew
//                 const saveResponse = await axios.post(`${API_URL}/api/v2/save`, castAndCrewData);

//                 if (saveResponse.status === 201) {
//                     Swal.fire({
//                         title: 'Success!',
//                         text: 'Video and cast/crew data saved successfully',
//                         icon: 'success',
//                         confirmButtonText: 'OK'
//                     });
//                 } else {
//                     Swal.fire({
//                         title: 'Error!',
//                         text: 'Error saving cast and crew data',
//                         icon: 'error',
//                         confirmButtonText: 'OK'
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error uploading video:', error);
//                 Swal.fire({
//                     title: 'Error!',
//                     text: 'Error uploading video',
//                     icon: 'error',
//                     confirmButtonText: 'OK'
//                 });
//             }
//         } else {
//             Swal.fire({
//                 title: 'Limit Reached',
//                 text: 'The upload limit has been reached',
//                 icon: 'warning',
//                 confirmButtonText: 'OK'
//             });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         Swal.fire({
//             title: 'Error!',
//             text: 'An error occurred',
//             icon: 'error',
//             confirmButtonText: 'OK'
//         });
//     }
// };


//   return (

    

    
//         <div className='container2 mt-20'>
//           {/* <h1 className="mt-4 text-white">Add Video</h1> */}
//           <ol className="breadcrumb mb-4">
//             <li className="breadcrumb-item"><Link to="/admin/Video">Videos</Link>
//             </li>
//             <li className="breadcrumb-item active  text-white">Add Video</li>
//           </ol>
//           <div className='row'>
               
//                 <div className='card-body'>
//                   {/* <form className='form-container'> */}
//                   <div className='modal-body '>
//                     <div className='temp'>
//                     <div className='col-lg-6'>
//                       <label >Movie_name</label>
//                     <input
//                       type="text"
//                       name="Movie_name"
//                       // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
//                       className="form-control"
//                       onChange={changeMovie_name}
//                       value={Movie_name}
//                     />
//                     </div>
//                     <div className='col-lg-6'>
//                       <label >Year</label>
//                     <input
//                       type="text"
//                       name="Movie_name"
//                       // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
//                       className="form-control"
//                       onChange={changeYear}
//                       value={Year}
//                     />
//                     </div>
//                     </div>
//                     <br></br>
//                     <div className='temp'>
//                     <div className='col-lg-6'>
//                       <label >Tag</label>
//                       <select
//                   className='form-control'
//                   name='category'
//                   value={TagId}
//                   onChange={(e) => setTagId(e.target.value)}
//                 >
//                 <option value=''>Select Tag</option>
//                     {Tag.map((Tags) => (
//                      <option key={Tags.id} value={Tags.tag}>
//                     {Tags.tag}
//                 </option>
//                 ))}
//                </select>
//                   {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
//                   <br />
//                     </div>
//                     <div className='col-lg-6'>
//                       <label >Category</label>
//                     <select
//                   className='form-control'
//                   name='category'
//                   value={categoryId}
//                   onChange={(e) => setCategoryId(e.target.value)}
//                 >
//                 <option value=''>Select Category</option>
//                     {categories.map((category) => (
//                      <option key={category.id} value={category.categories}>
//                     {category.categories}
//                 </option>
//                 ))}
//                </select>
//                   {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
//                   <br />
//                     </div>
//                     </div>
//                     <br></br>
//                     <div className='temp'>
//                     <div className='col-lg-6'>
//                       <label >Certificate</label>
//                       <select
//                   className='form-control'
//                   name='category'
//                   value={certificateId}
//                   onChange={(e) => setCertificateId(e.target.value)}
//                 >
//                 <option value=''>Select Certificate</option>
//                     {Certificate.map((certificate) => (
//                      <option key={certificate.id} value={certificate.certificate}>
//                     {certificate.certificate}
//                 </option>
//                 ))}
//                </select>
//                   {errors.certificateId && <div className="error-message">{errors.certificateId}</div>}
//                   <br />
//                     </div>
//                     <div className='col-lg-6'>
//                       <label >Language</label>
//                       <select
//                   className='form-control'
//                   name='category'
//                   value={LanguageId}
//                   onChange={(e) => setLanguageId(e.target.value)}
//                 >
//                 <option value=''>Select Language</option>
//                     {Language.map((language) => (
//                      <option key={language.id} value={language.language}>
//                     {language.language}
//                 </option>
//                 ))}
//                </select>
//                   {errors.certificateId && <div className="error-message">{errors.certificateId}</div>}
//                   <br />
//                     </div>
//                     </div>
//                     <br></br>
//                     <div className='temp'>
//                     <div className='col-lg-6'>
//                       <label >Duration</label>
//                     <input
//                       type="text"
//                       name="Movie_name"
//                       // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
//                       className="form-control"
//                       onChange={changeDuration}
//                       value={Duration}
//                     />
//                     </div>
//                     <br></br>
//                     <div className='col-lg-6'>
//                       <label >Description</label>
//                     <input
//                       type="text"
//                       name="Description"
//                       // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
//                       className="form-control"
//                       onChange={changeDescription}
//                       value={Description}
//                     />
//                     </div>
//                     </div>

// <br />
// <div className='temp'>
//       <div className="col-lg-6">
//         <label>Cast & Crew</label>
//         <div className="dropdown-container" ref={dropdownRef}>
//           <div className="dropdown">
//             <button
//               type="button"
//               className="btn btn-secondary dropdown-toggle form-control"
//               onClick={toggleDropdown}
//             >
//               {castandcrewlist.length > 0 ? 'Selected' : 'Select Cast & Crew'}
//             </button>
//             {isOpen && (
//               <div className="dropdown-menu show">
//                 {Getall.map(option => (
//                   <div key={option.id} className="dropdown-item">
//                     <input
//                       type="checkbox"
//                       value={option.name}
//                       checked={castandcrewlist.includes(option.id)}
//                       onChange={handleCheckboxChange(option)}
//                     />
//                     <label className="ml-2">{option.name}</label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           {castandcrewlist.length > 0 && (
//             <div className="selected-items">
//               <label>Selected:</label>
//               {castandcrewlist.map(id => (
//                 <div key={id}>
//                   {Getall.find(option => option.id === id)?.name} {/* Display name based on ID */}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//                   <h5 className='modal-title modal-header' style={{ fontFamily: 'Poppins' }}>
//                       Choose Pricing Option
//                   </h5>
//                   <div className='temp'>
//     <div className='col-lg-1'>
//         <label>
//             <input
//                 type="radio"
//                 value="free"
//                 checked={selectedOption === 'free'}
//                 onChange={handleRadioChange}
//             />
//             Free
//         </label>
//     </div>
//     <div className='col-lg-1'>
//         <label>
//         <div
//           className={`radio-button${selectedOption === 'paid' ? ' selected' : ''}`}
//           onMouseEnter={handlePaidRadioHover}
//           onClick={() => {
//               if (hasPaymentPlan()) {
//                   setSelectedOption('paid');
//               }
//           }}
//       >
//             <input
//                 type="radio"
//                 value="paid"
//                 checked={selectedOption === 'paid'}
//                 disabled={!hasPaymentPlan()}
//                 onChange={() => {
//                     if (hasPaymentPlan()) {
//                         setSelectedOption('paid');
//                     }
//                 }}
               
//             />
//             Paid
//             </div>
//         </label>
//     </div>
// </div>



//                         <div className='col-lg-12'>
//                     <label >Thumbnail</label>
//                     {imageUrl && (
//           <div className="col-md-12 mt-4 text-center">
//             <img src={imageUrl} alt="Preview" className="img-fluid" style={{ width:'100px' , height:'100px' }} />
//           </div>
//         )}
//         <br />
//                     <input
//           type='file'
//           className='form-control'
//           placeholder='Choose Thumbnail'
//           name='thumbnail'
//           onChange={handleImageChange}
//         />
//         </div><br/>
//         <div className='col-lg-12'>
//         <label >AddMovie</label>
//          <br></br>
//                     <input type="file" accept="video/*" onChange={handleFile} />
//                     {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
//                     <br></br>
//                     <br></br>
//                     </div>
//                     <div style={{display:'flex',textAlign:'center'}}>
//                     <div className='col-lg-6'>
//                     <button className='text-center btn btn-info' onClick={save}>Add_Details</button>{/*handleUpload*/}&nbsp;&nbsp;
//                     {/* <Link to="/admin/AddMovie" className="btn btn-info">Add</Link>&nbsp;&nbsp; */}
//                     {/* <button className='text-center btn btn-info' onClick={Upload}>Upload</button>&nbsp;&nbsp; */}
//                    </div>
//                    <div className='col-lg-6'>
//                     {/* <button className='text-center btn btn-info' > */}
//                     {/* <Link to="/admin/Watch" className="btn btn-info">Play</Link> */}
//                     {/* </button> */}
//                     {/* {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>} */}
// </div>
//                   </div>
//                   </div>

//                   {/* </form> */}
//                 </div>
             
          
//           </div>
//        </div>
     
  
 
    
//   );
// }

// export default AddVideo;



import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../Config';
import "../css/Sidebar.css";

import "../App.css"
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'


import React, { useState, useEffect, useRef } from 'react';

const AddVideo = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoryId, setCategoryId] = useState('');
  const [Certificate, setCertificate] = useState([]);
  const [certificateId, setCertificateId] = useState('');
  const [Language, setLanguage] = useState([]);
  const [LanguageId, setLanguageId] = useState('');
  const [Tag, setTag] = useState([]);
  const [TagId, setTagId] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [selected, setSelected] = useState(false);
  const [getall,setgetall] = useState(''); 
  const [Getall,setGetall] = useState('');
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('free');
  const [imageUrl, setImageUrl] = useState(null); // To display image preview
  const token = sessionStorage.getItem("tokenn")

  const [isOpen, setIsOpen] = useState(false);
  const [castandcrewlist, setcastandcrewlist] = useState([]);
  const dropdownRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    // Display image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option) => (e) => {
    const isChecked = e.target.checked;
    const id = (option.id); // Convert ID to number
  
    if (isChecked) {
      setcastandcrewlist((prevList) => [...prevList, id]);
    } else {
      setcastandcrewlist((prevList) => prevList.filter((item) => item !== id));
    }
  };


  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllcastandcrew`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetall(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllPlans`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setgetall(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
};

const handlePaidRadioHover = () => {
  if (!hasPaymentPlan()) {
    Swal.fire({
      title: 'Error!',
      text: 'You first need to add a payment plan to enable this option.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Go to Add plan page',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin/Adminplan');
      } else if (result.isDismissed) {
        console.log('Cancel was clicked');
      }
    });
  }
};


const hasPaymentPlan = () => {
     return getall.length > 0;
    // return false;
};


  // const fetchData = async () => {
    useEffect(() => {
   
    
    fetch(`${API_URL}/api/v2/GetAllCategories`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCategories(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    fetch(`${API_URL}/api/v2/GetAllCertificate`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCertificate(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      fetch(`${API_URL}/api/v2/GetAllLanguage`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLanguage(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      fetch(`${API_URL}/api/v2/GetAllTag`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTag(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });



    }, []);

  // fetchData();
  const [Movie_name, setMovie_name] = useState('');
  const changeMovie_name = (event) => {
    const newValue = event.target.value;
    setMovie_name(newValue); // Updating the state using the setter function
  };
  const [Year, setYear] = useState('');
  const changeYear = (event) => {
    const newValue = event.target.value;
    setYear(newValue); // Updating the state using the setter function
  };
  const [Duration, setDuration] = useState('');
  const changeDuration = (event) => {
    const newValue = event.target.value;
    setDuration(newValue); // Updating the state using the setter function
  };
  const [Description, setDescription] = useState('');
  const changeDescription = (event) => {
    const newValue = event.target.value;
    setDescription(newValue); // Updating the state using the setter function
  };
  const [Cast_Crew, setCast_Crew] = useState('');
  const changeCast_Crew = (event) => {
    const newValue = event.target.value;
    setCast_Crew(newValue); // Updating the state using the setter function
  };

  // const handleFileChange = (event) => {
  //   // setThumbnail(event.target.files[0]);
  //   // setFile(event.target.files[0]);
  // };
  // const handleFile = (event) => {
  //   // setThumbnail(event.target.files[0]);
  //   setFile(event.target.files[0]);
  // };

  const handleRadioClick = () => {
    setSelected(!selected); // Toggle the value of 'selected'
  };


  const Upload = async () => {
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${API_URL}/api/v2/postit`, formData, {

      headers: {
        'Content-Type': 'multipart/form-data',
      },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });
      console.log(response.data);

      console.log('Upload successful!', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  

  // const save = async (e) => {
  //   e.preventDefault();

  //   try {
  //   const formData = new FormData();
  //   const audioData = {
        
  //     thumbnail: thumbnail,
  //   };
  //   console.log("audioData")
  //   console.log(audioData)
  //   const Addvideo = { Movie_name: Movie_name, tags: TagId, description: Description,category: categoryId,certificate: certificateId,Language: LanguageId,Duration:Duration,Year:Year,thumbnail:thumbnail,video:file, paid: selected ? 1 : 0,};
  //   console.log(Addvideo);


  //   for (const key in Addvideo) {
  //     formData.append(key, Addvideo[key]);
  //   }

  //   const response = await axios.post(`${API_URL}/api/uploaddescriprion`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
  //         setUploadProgress(progress);
  //       }
  //     });
  //       console.log(response.data);
  //     console.log("video updated successfully");
  //   } catch (error) {
  //     console.error('Error uploading audio:', error);
  //     // Handle error, e.g., show an error message to the user
  //   }
   
  //   // Employee.setVideo(Addvideo).then(res => {
  //   //   // handleUpload();
  //   //   setMovie_name('');
  //   //   setTags('');
  //   //   setDescription('');
  //   // })
  // }

  
  // const save = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     // First fetch request to check the count
  //     const response = await fetch(`${API_URL}/api/v2/count`, {
  //       method: 'GET',
  //     });
  
  //     console.log(response);
  
  //     if (response.ok) {
  //       try {
  //         // Initialize formData
  //         const formData = new FormData();
  
  //         // Define Addvideo object with the necessary data
  //         const Addvideo = {
  //           Movie_name: Movie_name,
  //           tags: TagId,
  //           description: Description,
  //           category: categoryId,
  //           certificate: certificateId,
  //           Language: LanguageId,
  //           Duration: Duration,
  //           Year: Year,
  //           thumbnail: thumbnail,
  //           video: file,
  //           paid: selectedOption === 'paid' ? 1 : 0,
  //         };
  
  //         // Append cast and crew list to formData
  //         castandcrewlist.forEach((id) => {
  //           formData.append('castandcrewlist', id);
  //         });
  
  //         // Append Addvideo properties to formData
  //         for (const key in Addvideo) {
  //           formData.append(key, Addvideo[key]);
  //         }
  
  //         console.log("Addvideo:");
  //         console.log(Addvideo);
  
  //         // Make the POST request to upload description
  //         const uploadResponse = await axios.post(`${API_URL}/api/uploaddescriprion`, formData, {
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //           },
  //           onUploadProgress: (progressEvent) => {
  //             const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
  //             setUploadProgress(progress);
  //           },
  //         });
  
  //         console.log(uploadResponse.data);
  //         console.log("Video updated successfully");
  //       } catch (error) {
  //         console.error('Error uploading video:', error);
  //         // Handle error, e.g., show an error message to the user
  //       }
  //     } else {
  //       alert("Limit reached");
  //     }
  //   } catch (error) {
  //     console.error('Error fetching count:', error);
  //   }
  // };


//   const save = async (e) => {
//     e.preventDefault();
//     try {
//         const response = await fetch(`${API_URL}/api/v2/count`, {
//             method: 'GET',
//         });
//         console.log(response);
//         if (response.ok) {
//             try {
//                 const formData = new FormData();
//                 formData.append('moviename', Movie_name);
//                 formData.append('description', Description);
//                 formData.append('tags', TagId);
//                 formData.append('category', categoryId);
//                 formData.append('certificate', certificateId);
//                 formData.append('language', LanguageId);
//                 formData.append('duration', Duration);
//                 formData.append('year', Year);
//                 formData.append('thumbnail', thumbnail);
//                 formData.append('video', file);
//                 formData.append('paid', selectedOption === 'paid' ? 1 : 0);

//                 // Correctly append each item in castandcrewlist
//                 castandcrewlist.forEach((id) => {
//                   formData.append('castandcrewlist', id);
//                 });

//                 const uploadResponse = await axios.post(`${API_URL}/api/uploaddescription`, formData, {
//                     onUploadProgress: (progressEvent) => {
//                         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//                         setUploadProgress(progress);
//                     }
//                 });

//                 console.log(uploadResponse.data);
//                 Swal.fire({
//                     title: 'Success!',
//                     text: 'Video updated successfully',
//                     icon: 'success',
//                     confirmButtonText: 'OK'
//                 });
//             } catch (error) {
//                 console.error('Error uploading video:', error);
//                 Swal.fire({
//                     title: 'Error!',
//                     text: 'Error uploading video',
//                     icon: 'error',
//                     confirmButtonText: 'OK'
//                 });
//             }
//         } else {
//             Swal.fire({
//                 title: 'Limit Reached',
//                 text: 'The upload limit has been reached',
//                 icon: 'warning',
//                 confirmButtonText: 'OK'
//             });
//         }
//     } catch (error) {
//         console.error('Error ', error);
//         Swal.fire({
//             title: 'Error!',
//             text: 'An error occurred',
//             icon: 'error',
//             confirmButtonText: 'OK'
//         });
//     }

//     console.log("audioData");
//     const Addvideo = { 
//         Movie_name, 
//         tags: TagId, 
//         description: Description, 
//         category: categoryId, 
//         certificate: certificateId, 
//         language: LanguageId, 
//         duration: Duration, 
//         year: Year, 
//         thumbnail, 
//         video: file, 
//         paid: selectedOption === 'paid' ? 1 : 0,
//         castandcrewlist: castandcrewlist // Add the selectedItems to the object
//     };

//     console.log(Addvideo);
// };


const save = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch(`${API_URL}/api/v2/count`, {
            method: 'GET',
        });

        if (response.ok) {
            try {
                const formData = new FormData();
                formData.append('moviename', Movie_name);
                formData.append('description', Description);
                formData.append('tags', TagId);
                formData.append('category', categoryId);
                formData.append('certificate', certificateId);
                formData.append('language', LanguageId);
                formData.append('duration', Duration);
                formData.append('year', Year);
                formData.append('thumbnail', thumbnail);
                formData.append('video', file);
                formData.append('paid', selectedOption === 'paid');

                // Upload video description
                const uploadResponse = await axios.post(`${API_URL}/api/v2/uploaddescription`, formData, {
                  headers: {
                    Authorization: token, // Pass the token in the Authorization header
                   'Content-Type': 'multipart/form-data',
                 },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                    }
                });

                const videoId = uploadResponse.data.id; // Assuming the response contains the video ID

                // Prepare data for the second API call
                const castAndCrewData = new FormData();
                castAndCrewData.append('videoId', videoId);
                castandcrewlist.forEach((id) => {
                    castAndCrewData.append('castAndCrewIds', id);
                });

                // Save cast and crew
                const saveResponse = await axios.post(`${API_URL}/api/v2/save`, castAndCrewData);

                if (saveResponse.status === 201) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Video and cast/crew data saved successfully',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error saving cast and crew data',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Error uploading video',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            Swal.fire({
                title: 'Limit Reached',
                text: 'The upload limit has been reached',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'An error occurred',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};


const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  handleFile(file);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  handleFile(file);
};

const [videoUrl, setVideoUrl] = useState(null);

// const handleVideoFileChange = (event) =>{
//   const file = event.target.files[0];
//   if (file) {
//       const videoUrl = URL.createObjectURL(file);
//       setVideoUrl(videoUrl);
//     }
// }

const handleVideoFileChange = (event) => {
  const file = event.target.files[0];
  console.log('File selected:', file);
  if (file) {
    const videoUrl = URL.createObjectURL(file);
    console.log('Video URL:', videoUrl);
    setVideoUrl(videoUrl);
  }
};



const handleVideoDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    const videoUrl = URL.createObjectURL(file);
    setVideoUrl(videoUrl);
  }
};



const handleFile = (file) => {
  if (file && file.type === 'image/png') {
    setError('');
    setImage(file);

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  } else {
    setError('Only PNG files are accepted.');
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
};




  return (
<div className='container3 mt-20'>
  <ol className="breadcrumb mb-4 d-flex my-0">
    <li className="breadcrumb-item"><Link to="/admin/Video">Videos</Link></li>
    <li className="breadcrumb-item active text-white">Add Video</li>
  </ol>
  
  <div className="outer-container">
    <div className="table-container">
    {currentStep === 1 && (
            <>
      <div className="row py-3 my-3 align-items-center w-100">

        {/* Video Title */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            {/* <div className="flex-shrink-0 me-2"> */}
            <div className="label-width">
              <label className="custom-label">Video Title</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='Video Title'
                id='name'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Video Title" 
              />
            </div>
          </div>
        </div>


        {/* Main Video Duration */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Main Video Duration</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='main_video_duration'
                id='main_video_duration'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Main Video Duration" 
              />
            </div>
          </div>
        </div>


        
      </div>

      <div className="row py-3 my-3 align-items-center w-100">

        {/* Trailer Duration */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Trailer Duration</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='trailer_duration'
                id='trailer_duration'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Trailer Duration" 
              />
            </div>
          </div>
        </div>

        {/* Certificate Name */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            {/* <div className="flex-shrink-0 me-2"> */}
            <div className="label-width">
              <label className="custom-label">Certificate Name</label>
            </div>
            <div className="flex-grow-1">
              <select 
                name='certificatename'
                id='certificate_name'
                required
                className="form-control border border-dark border-2 input-width"
              >
                <option value="">Select certificate</option>
                <option value="13+">U</option>
                <option value="16+">U/A</option>
                <option value="18+">U</option>
              </select>
            </div>
          </div>
        </div>


      </div>

      <div className="row py-3 my-3 align-items-center w-100">

        {/* Rating */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Rating</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='rating'
                id='rating'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="/10" 
              />
            </div>
          </div>
        </div>

        {/* Cast and Crew */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            {/* <div className="flex-shrink-0 me-2"> */}
            <div className="label-width">
              <label className="custom-label">Cast and Crew</label>
            </div>
            <div className="flex-grow-1">
              <select 
                name='certificatename'
                id='certificate_name'
                required
                className="form-control border border-dark border-2 input-width"
              >
                <option value="">Cast and Crew</option>
                <option value="13+">U</option>
                <option value="16+">U/A</option>
                <option value="18+">U</option>
              </select>
            </div>
          </div>
        </div>


      </div>

      <div className="row py-3 my-3 align-items-center w-100">

        {/* Certificate No */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Certificate No</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='certificate_no'
                id='certificate_no'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Certificate No" 
              />
            </div>
          </div>
        </div>

        {/* Empty Div with Border, Border Radius, and Increased Height */}
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <div className="flex-grow-1 border border-dark border-2 p-3" 
           style={{ borderRadius: '13px', height: '130px' }}>
        {/* The div is empty, with only the border */}
      </div>
    </div>
  </div>

      </div>

      <div className="row py-3 my-3 align-items-center w-100">

        {/* Subscription Type */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Video Access Type</label>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex">
                <div className="form-check form-check-inline">
                  <input 
                    className="form-check-input"
                    type="radio"
                    name="subscriptionType"
                    id="paid"
                    value="Paid"
                  />
                  <label className="form-check-label" htmlFor="paid">Paid</label>
                </div>
                <div className="form-check form-check-inline ms-3">
                  <input 
                    className="form-check-input"
                    type="radio"
                    name="subscriptionType"
                    id="free"
                    value="Free"
                  />
                  <label className="form-check-label" htmlFor="free">Free</label>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      

      <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                >
                  Cancel
                </button>
                {/* <Link to="/admin/AddVideo1"> */}
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  onClick={nextStep}
                >
                  Next
                </button>
                {/* </Link> */}
              </div>
            </div>
            </>
          )}

{currentStep === 2 && (
            <>

<div className="row py-3 my-3 align-items-center w-100">

 {/* Address */}
 <div className="col-md-6">
    <div className="d-flex align-items-center">
      <div className="label-width">
        <label className="custom-label">Description</label>
      </div>
      <div className="flex-grow-1">
        <textarea 
          name='description'
          id='description'
          required
          className="form-control border border-dark border-2 input-width" 
          placeholder="description"
          rows="2"
        ></textarea>
      </div>
    </div>
  </div>

{/* Main Video Duration */}
<div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Production Company</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='main_video_duration'
                id='main_video_duration'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Production Company" 
              />
            </div>
          </div>
        </div>


</div>

<div className="row py-3 my-3 align-items-center w-100">

  
  <div className="col-md-6">
  <div className="d-flex align-items-center">
    <div className="label-width">
      <label className="custom-label">Tag</label>
    </div>
    <div className="flex-grow-1 position-relative">
      <select 
        name='certificatename'
        id='certificate_name'
        required
        className="form-control border border-dark border-2 input-width select-with-arrow"
      >
        <option value="" >Tag</option>
        <option value="13+">U</option>
        <option value="16+">U/A</option>
        <option value="18+" >U</option>
      </select>
      <span className="dropdown-arrow"></span>
    </div>
  </div>
</div>


<div className="col-md-6">
  <div className="d-flex align-items-center">
    <div className="label-width">
      <label className="custom-label">Category</label>
    </div>
    <div className="flex-grow-1 position-relative">
      <select 
        name='certificatename'
        id='certificate_name'
        required
        className="form-control border border-dark border-2 input-width select-with-arrow"
      >
        <option value="">Category</option>
        <option value="13+">U</option>
        <option value="16+">U/A</option>
        <option value="18+">U</option>
      </select>
      <span className="dropdown-arrow"></span>
    </div>
  </div>
</div>
</div>




<div className="row py-3 my-3 align-items-center w-100">

  {/* Empty Div with Border, Border Radius, and Increased Height */}
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <div className="flex-grow-1 border border-dark border-2 p-3" 
           style={{ borderRadius: '13px', height: '130px' }}>
        {/* The div is empty, with only the border */}
      </div>
    </div>
  </div>

  {/* Another Empty Div with Border, Border Radius, and Increased Height */}
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <div className="flex-grow-1 border border-dark border-2 p-3" 
           style={{ borderRadius: '13px', height: '130px' }}>
        {/* The div is empty, with only the border */}
      </div>
    </div>
  </div>

</div>





            
    <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
                {/* <Link to="/admin/AddVideo"> */}
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </button>
                {/* </Link> */}
                {/* <Link to="/admin/AddVideo2"> */}
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  onClick={nextStep}
                >
                  Next
                </button>
                {/* </Link> */}
              </div>
            </div>

            </>
          )}

{currentStep === 3 && (
  <>
    <div className="row py-3 my-3 align-items-center w-100">
    {/* First Instance */}
    <div className="col-md-6">
    <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">Original Video</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  backgroundVideo: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!imageUrl && <span>Drag and drop</span>}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('fileInput1').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="fileInput1"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-2">
              <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Instance */}
      <div className="col-md-6">
        <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">Video Thumbnail</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!imageUrl && <span>Drag and drop</span>}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('fileInput2').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="fileInput2"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-2">
              <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div className="row py-3 my-3 align-items-center w-100">
    {/* First Instance */}
    <div className="col-md-6">
    <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">Trailer Video</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                onDrop={handleVideoDrop}
                onDragOver={handleDragOver}
                style={{
                  // backgroundVideo: videoUrl ? `url(${videoUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span>Drag and drop</span>
              )}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('fileInput1').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="fileInput1"
                style={{ display: 'none' }}
                onChange={handleVideoFileChange}
              />
            </div>
            <div className="mt-2">
              <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Instance */}
      <div className="col-md-6">
        <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">Trailer Thumbnail</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!imageUrl && <span>Drag and drop</span>}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('fileInput2').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="fileInput2"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-2">
              <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div className="row py-3 my-3 align-items-center w-100">
    {/* First Instance */}
    <div className="col-md-6">
    <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">User Banner</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!imageUrl && <span>Drag and drop</span>}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('fileInput1').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="fileInput1"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-2">
              <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
            </div>
          </div>
        </div>
      </div>
</div>

<div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
                {/* <Link to="/admin/AddVideo"> */}
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </button>
                {/* </Link> */}
                {/* <Link to="/admin/AddVideo2"> */}
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  onClick={nextStep}
                >
                  Next
                </button>
                {/* </Link> */}
              </div>
            </div>


  </>
)}

{currentStep === 4 && (
            <>
            <div className="preview-container d-flex justify-content-center align-items-center">
        <div className="d-flex">
          <div className="flex-grow-1">
            <div className='text-black'>Movie Name : Aayan</div>
            <div className="video-container mt-3">
              <video  controls>
                <source src="path-to-your-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="details-box ml-4 p-3 border border-dark border-2">
          
          <div class="row">
            <div class="col-6">
              <div className='text-black'> Video Title:</div>
              <div className='text-black'>Main Video Duration:</div>
              <div className='text-black'>Trailer duration:</div>
              <div className='text-black'>Cast and Crew:</div>
              <div className='text-black'>Certificate No:</div>
              <div className='text-black'>Certificate name:</div>
              <div className='text-black'>Video access type:</div>
              <div className='text-black'>Category:</div>
              <div className='text-black'>Tag:</div>
              <div className='text-black'>Production Company:</div>
              <div className='text-black'>Description:</div>
            </div>
            <div class="col-6">
              <p>Aayan</p>
              <p>2hrs</p>
              <p>2mins</p>
              <p>Suriya, Tamana, Prabu</p>
              <p>91234467</p>
              <p>U/A</p>
              <p>Paid</p>
              <p>Action</p>
              <p>#aayan, #suriya, #tamana, #harris jeyaraj</p>
              <p>Sun pictures</p>
              <p>The most hunting hero is serious about the job assigned...</p>
            </div>
          </div>
        </div>
      </div>
    
        </div>


        <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
               
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </button>
               
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  
                >
                  Submit
                </button>
                
              </div>
            </div>

        
   
  </>
)}


    </div>
  </div>
</div>

        
     
  
 
    
  );
}

export default AddVideo;





