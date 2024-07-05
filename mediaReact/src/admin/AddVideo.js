
// ---------------------------------------------------------------------
// import React, { useState } from 'react';
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

  const [isOpen, setIsOpen] = useState(false);
  const [castandcrewlist, setcastandcrewlist] = useState([]);
  const dropdownRef = useRef(null);

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

  const handleFileChange = (event) => {
    // setThumbnail(event.target.files[0]);
    // setFile(event.target.files[0]);
  };
  const handleFile = (event) => {
    // setThumbnail(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleRadioClick = () => {
    setSelected(!selected); // Toggle the value of 'selected'
  };


  const Upload = async () => {
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${API_URL}/api/postit`, formData, {

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
                const uploadResponse = await axios.post(`${API_URL}/api/uploaddescription`, formData, {
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


  return (

    

      <div className='container-fluid'>
        <div className='container2'>
          {/* <h1 className="mt-4 text-white">Add Video</h1> */}
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Add Video</li>
          </ol>
          <div className='row'>
               
                <div className='card-body'>
                  {/* <form className='form-container'> */}
                  <div className='modal-body '>
                    <div className='temp'>
                    <div className='col-lg-6'>
                      <label >Movie_name</label>
                    <input
                      type="text"
                      name="Movie_name"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={changeMovie_name}
                      value={Movie_name}
                    />
                    </div>
                    <div className='col-lg-6'>
                      <label >Year</label>
                    <input
                      type="text"
                      name="Movie_name"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={changeYear}
                      value={Year}
                    />
                    </div>
                    </div>
                    <br></br>
                    <div className='temp'>
                    <div className='col-lg-6'>
                      <label >Tag</label>
                      <select
                  className='form-control'
                  name='category'
                  value={TagId}
                  onChange={(e) => setTagId(e.target.value)}
                >
                <option value=''>Select Tag</option>
                    {Tag.map((Tags) => (
                     <option key={Tags.id} value={Tags.tag}>
                    {Tags.tag}
                </option>
                ))}
               </select>
                  {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
                  <br />
                    </div>
                    <div className='col-lg-6'>
                      <label >Category</label>
                    <select
                  className='form-control'
                  name='category'
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                <option value=''>Select Category</option>
                    {categories.map((category) => (
                     <option key={category.id} value={category.categories}>
                    {category.categories}
                </option>
                ))}
               </select>
                  {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
                  <br />
                    </div>
                    </div>
                    <br></br>
                    <div className='temp'>
                    <div className='col-lg-6'>
                      <label >Certificate</label>
                      <select
                  className='form-control'
                  name='category'
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                >
                <option value=''>Select Certificate</option>
                    {Certificate.map((certificate) => (
                     <option key={certificate.id} value={certificate.certificate}>
                    {certificate.certificate}
                </option>
                ))}
               </select>
                  {errors.certificateId && <div className="error-message">{errors.certificateId}</div>}
                  <br />
                    </div>
                    <div className='col-lg-6'>
                      <label >Language</label>
                      <select
                  className='form-control'
                  name='category'
                  value={LanguageId}
                  onChange={(e) => setLanguageId(e.target.value)}
                >
                <option value=''>Select Language</option>
                    {Language.map((language) => (
                     <option key={language.id} value={language.language}>
                    {language.language}
                </option>
                ))}
               </select>
                  {errors.certificateId && <div className="error-message">{errors.certificateId}</div>}
                  <br />
                    </div>
                    </div>
                    <br></br>
                    <div className='temp'>
                    <div className='col-lg-6'>
                      <label >Duration</label>
                    <input
                      type="text"
                      name="Movie_name"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={changeDuration}
                      value={Duration}
                    />
                    </div>
                    <br></br>
                    <div className='col-lg-6'>
                      <label >Description</label>
                    <input
                      type="text"
                      name="Description"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={changeDescription}
                      value={Description}
                    />
                    </div>
                    </div>

<br />
<div className='temp'>
      <div className="col-lg-6">
        <label>Cast & Crew</label>
        <div className="dropdown-container" ref={dropdownRef}>
          <div className="dropdown">
            <button
              type="button"
              className="btn btn-secondary dropdown-toggle form-control"
              onClick={toggleDropdown}
            >
              {castandcrewlist.length > 0 ? 'Selected' : 'Select Cast & Crew'}
            </button>
            {isOpen && (
              <div className="dropdown-menu show">
                {Getall.map(option => (
                  <div key={option.id} className="dropdown-item">
                    <input
                      type="checkbox"
                      value={option.name}
                      checked={castandcrewlist.includes(option.id)}
                      onChange={handleCheckboxChange(option)}
                    />
                    <label className="ml-2">{option.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
          {castandcrewlist.length > 0 && (
            <div className="selected-items">
              <label>Selected:</label>
              {castandcrewlist.map(id => (
                <div key={id}>
                  {Getall.find(option => option.id === id)?.name} {/* Display name based on ID */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
                  <h5 className='modal-title modal-header' style={{ fontFamily: 'Poppins' }}>
                      Choose Pricing Option
                  </h5>
                  <div className='temp'>
    <div className='col-lg-1'>
        <label>
            <input
                type="radio"
                value="free"
                checked={selectedOption === 'free'}
                onChange={handleRadioChange}
            />
            Free
        </label>
    </div>
    <div className='col-lg-1'>
        <label>
        <div
          className={`radio-button${selectedOption === 'paid' ? ' selected' : ''}`}
          onMouseEnter={handlePaidRadioHover}
          onClick={() => {
              if (hasPaymentPlan()) {
                  setSelectedOption('paid');
              }
          }}
      >
            <input
                type="radio"
                value="paid"
                checked={selectedOption === 'paid'}
                disabled={!hasPaymentPlan()}
                onChange={() => {
                    if (hasPaymentPlan()) {
                        setSelectedOption('paid');
                    }
                }}
               
            />
            Paid
            </div>
        </label>
    </div>
</div>



                        <div className='col-lg-12'>
                    <label >Thumbnail</label>
                    {imageUrl && (
          <div className="col-md-12 mt-4 text-center">
            <img src={imageUrl} alt="Preview" className="img-fluid" style={{ width:'100px' , height:'100px' }} />
          </div>
        )}
        <br />
                    <input
          type='file'
          className='form-control'
          placeholder='Choose Thumbnail'
          name='thumbnail'
          onChange={handleImageChange}
        />
        </div><br/>
        <div className='col-lg-12'>
        <label >AddMovie</label>
         <br></br>
                    <input type="file" accept="video/*" onChange={handleFile} />
                    {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
                    <br></br>
                    <br></br>
                    </div>
                    <div style={{display:'flex',textAlign:'center'}}>
                    <div className='col-lg-6'>
                    <button className='text-center btn btn-info' onClick={save}>Add_Details</button>{/*handleUpload*/}&nbsp;&nbsp;
                    {/* <Link to="/admin/AddMovie" className="btn btn-info">Add</Link>&nbsp;&nbsp; */}
                    {/* <button className='text-center btn btn-info' onClick={Upload}>Upload</button>&nbsp;&nbsp; */}
                   </div>
                   <div className='col-lg-6'>
                    {/* <button className='text-center btn btn-info' > */}
                    {/* <Link to="/admin/Watch" className="btn btn-info">Play</Link> */}
                    {/* </button> */}
                    {/* {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>} */}
</div>
                  </div>
                  </div>

                  {/* </form> */}
                </div>
             
          
          </div>
       </div></div>
  
 
    
  );
}

export default AddVideo;



