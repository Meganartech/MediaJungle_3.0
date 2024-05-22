import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import Employee from './Employee';
import API_URL from '../Config';


import React, { useState, useEffect } from 'react';

const EditVideo = (receivedData) => {

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
  const [updatedata, setUpdatedata] = useState([]);
  const [paid, setpaid] =useState('');
  const id=localStorage.getItem('items');

  // const fetchData = async () => {
    useEffect(() => {
   
        console.log("EditVideo="+id);
        
    
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

      const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/GetvideoDetail/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            setUpdatedata(data);
            setMovie_name(data.moviename);
            setCategoryId(data.category);
            setCertificateId(data.certificate);
            setDescription(data.description);
            setDuration(data.duration);
            setLanguageId(data.language)
            setTagId(data.tags);
            setYear(data.year);
            setpaid(data.paid)
        // Log the movie name here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  
    

      


    }, []);

  // fetchData();
  const handleFileChange = (event) => {


   
    // changeCast_Crew();
    // changeDescription();
    // changeDuration();
    // changeYear();
    // changeMovie_name();

  };
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
  //   // changeCast_Crew();
  //   // changeDescription();
  //   // changeDuration();
  //   // changeYear();
  //   // changeMovie_name();

  // };
  const handleFile = (event) => {
    // setThumbnail(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const Upload = async (props) => {
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
  
  
  

  const save = async (e) => {
    e.preventDefault();




    try {
    const formData = new FormData();
    // const audioData = {
        
    //   thumbnail: thumbnail,
    // };
    // console.log("audioData")
    // console.log(audioData)
    const Addvideo = { Movie_name: Movie_name, tags: TagId, description: Description,category: categoryId,certificate: certificateId,Language: LanguageId,Duration:Duration,Year:Year,paid:paid,id:updatedata.id};
    console.log(Addvideo);


    for (const key in Addvideo) {
      formData.append(key, Addvideo[key]);
    }

    const response = await axios.post(`${API_URL}/api/updatedescriprion`, formData, {
        headers: {
          'Content-Type': 'form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });
        console.log(response.data);
      console.log("updated successfully");
    } catch (error) {
      console.error('Error uploading audio:', error);
      // Handle error, e.g., show an error message to the user
    }
   
    // Employee.setVideo(Addvideo).then(res => {
    //   // handleUpload();
    //   setMovie_name('');
    //   setTags('');
    //   setDescription('');
    // })
  }

  const handleRadioClick = () => {
    setpaid(!paid); // Toggle the value of 'selected'
  };




  return (
    <div id="content-wrapper" class="d-flex flex-column" style={{ marginLeft: "13rem" }}>
      <div className='container-fluid'>
        <Sidebar />
        <div>
          {/* <h1 className="mt-4 text-white">Add Video</h1> */}
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item"><Link to="/Dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Add Video</li>
          </ol>
          <div className='row justify-content-center'>
            <div className='col-lg-12'>
              <div className="card shadow-lg border-0 rounded-lg mt-5" style={{ marginLeft: "0px", marginRight: "0px",minWidth: "100%" }} >
                <div className='card-header'>
                  <h2 className='text-center'>Add Movie</h2>
                </div>
                <div className='card-body'>
                  {/* <form className='form-container'> */}
                  <div className='modal-body '>
                    <div className='row'>
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
                    <div className='row'>
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
                      <label >category</label>
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
                    <div className='row'>
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
                    <div className='row'>
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
                    <div className='row'>
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

                    <div className='col-lg-6'>
                      <label>
                          Paid:
                          <div 
                              className={`radio-button${paid ? ' selected' : ''}`} // Apply 'selected' class if radio button is selected
                              onClick={handleRadioClick} // Handle click event
                          >
                              {/* Display custom radio button */}
                              <div className="radio-circle">
                                  <input
                                      type="radio"
                                      checked={paid}  // Use checked={paid} instead of checked={selected}
                                  />
                              </div>
                          </div>
                      </label>
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
                    {/* <label >Thumbnail</label>
                    <br></br>
                    <input
          type='file'
          className='form-control'
          placeholder='Choose Thumbnail'
          name='thumbnail'
          onChange={(e) => setThumbnail(e.target.files[0])}
        /> */}
        {/* <label >AddMovie</label> */}
         <br></br>
                    {/* <input type="file" accept="video/*" onChange={handleFile} />
                    {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>} */}
                    <br></br>
                    {/* <br></br>
                    <button className='text-center btn btn-info' onClick={save}>Add_Details</button>&nbsp;&nbsp; */}
                    {/* <Link to="/admin/AddMovie" className="btn btn-info">Add</Link>&nbsp;&nbsp; */}
                    {/* <button className='text-center btn btn-info' onClick={Upload}>Upload</button>&nbsp;&nbsp; */}
                   
                    {/* <button className='text-center btn btn-info' > */}
                    {/* <Link to="/admin/Watch" className="btn btn-info">Play</Link> */}
                    {/* <Link to="#" className="btn btn-info"></Link> */}
                    <button className='text-center btn btn-info' onClick={save}>Save</button>
                    {/* </button> */}
                    {uploadProgress > 0 && <p>Updating Progress: {uploadProgress}%</p>}

                  </div>

                  {/* </form> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditVideo