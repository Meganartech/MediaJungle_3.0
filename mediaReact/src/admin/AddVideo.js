
// ---------------------------------------------------------------------
// import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import Employee from './Employee';
import API_URL from '../Config';
import "../css/Sidebar.css";

import "../App.css"

import React, { useState, useEffect } from 'react';
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
  const save = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v2/count', {
           method: 'GET',
         });
         console.log(response)
         if (response.ok) {
          try {
            const formData = new FormData();
            const audioData = {
                
              thumbnail: thumbnail,
            };
            console.log("audioData")
            console.log(audioData)
            const Addvideo = { Movie_name: Movie_name, tags: TagId, description: Description,category: categoryId,certificate: certificateId,Language: LanguageId,Duration:Duration,Year:Year,thumbnail:thumbnail,video:file};
            console.log(Addvideo);
        

        
            for (const key in Addvideo) {
              formData.append(key, Addvideo[key]);
            }
        
            const response = await axios.post(`${API_URL}/api/uploaddescriprion`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                  const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                  setUploadProgress(progress);
                }
              });
                console.log(response.data);
              console.log("video updated successfully");
            } catch (error) {
              console.error('Error uploading audio:', error);
              // Handle error, e.g., show an error message to the user
            }
        
         }
         else{
          alert("limite reached");
     
         }
       } catch (error) {
         console.error('Error ', error);
       }
  
    console.log("audioData")
    const Addvideo = { Movie_name: Movie_name, tags: TagId, description: Description,category: categoryId,certificate: certificateId,Language: LanguageId,Duration:Duration,Year:Year,thumbnail:thumbnail,video:file, paid: selected ? 1 : 0,};
    console.log(Addvideo);




       
    // Employee.setVideo(Addvideo).then(res => {
    //   // handleUpload();
    //   setMovie_name('');
    //   setTags('');
    //   setDescription('');
    // })
  }

  return (

    <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem" }}>
             <Sidebar />

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
                    <div className='col-lg-6'>
                      <label >Cast&Crew</label>
                    <input
                      type="text"
                      name="Tags"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={changeCast_Crew}
                      value={Cast_Crew}
                    />
                    </div>
                    </div>
                    <br></br>
                    <div className='temp'>
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
                    {/* <div className='col-lg-6'>
                      <label >Name</label>
                    <input
                      type="text"
                      name="confirmPassword"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={""}
                      value={"categoryName"}
                    />
                    </div>*/}
                    </div> 
                    
                    {/* <br></br>
                    <input
                      type="text"
                      name="confirmPassword"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={''}
                      value={'categoryName'}
                    /> */}
                    <br></br>
                    {/* <input
                      type="text"
                      name="confirmPassword"
                      // className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      className="form-control"
                      onChange={''}
                      value={'categoryName'}
                    /> */} 

                    <div className='col-lg-6'>
                          <label>
                            Paid:
                            <div 
                              className={`radio-button${selected ? ' selected' : ''}`} // Apply 'selected' class if radio button is selected
                              onClick={handleRadioClick} // Handle click event
                            >
                              {/* Display custom radio button */}
                              <div className="radio-circle">
                              <input
                                  type="radio"
                                  value="paid"
                                  checked={selected}
                              />
                              </div>
                            </div>
                          </label>
                        </div>
                        <div className='col-lg-12'>
                    <label >Thumbnail</label>
                    <br></br>
                    <input
          type='file'
          className='form-control'
          placeholder='Choose Thumbnail'
          name='thumbnail'
          onChange={(e) => setThumbnail(e.target.files[0])}
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
        </div>
      </div>
    </div>
    
  );
}

export default AddVideo;



