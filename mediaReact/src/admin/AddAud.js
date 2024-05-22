import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
// import '../csstemp/addAudio.css';
import { Link } from 'react-router-dom';
import API_URL from '../Config';

const AddAud = () => {
  //.....................................Admin Function............................................
 
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${API_URL}/api/postit`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });

      console.log('Upload successful!', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  // const [Movie_name, setMovie_name] = useState('');
  // const changeMovie_name = (event) => {
  //   const newValue = event.target.value;
  //   setMovie_name(newValue); // Updating the state using the setter function
  // };
  // const [Tags, setTags] = useState('');
  // const changeTags = (event) => {
  //   const newValue = event.target.value;
  //   setTags(newValue); // Updating the state using the setter function
  // };
  // const [Description, setDescription] = useState('');
  // const changeDescription = (event) => {
  //   const newValue = event.target.value;
  //   setDescription(newValue); // Updating the state using the setter function
  // };
  

  const save = (e) => {
    e.preventDefault();
    // let Addvideo = { title: Movie_name, tags: Tags, description: Description};
    // console.log("employee =>"+JSON.stringify(Addvideo));
    // Employee.setVideo(Addvideo).then(res => {
    //   // handleUpload();
    //   setMovie_name('');
    //   setTags('');
    //   setDescription('');
    // })
  }
  
  return (
    <div id="content-wrapper" class="d-flex flex-column" style={{ marginLeft: "13rem" }}>
      <div className='container-fluid px-4'>
        <Navbar />
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
                    <br></br>
                    <input type="file" accept="video/*" onChange={handleFileChange} />
                    {/* <button className='text-center btn btn-info' onClick={save}>Add_Details</button>handleUpload&nbsp;&nbsp; */}
                    <button className='text-center btn btn-info' onClick={handleUpload}>Upload</button>{/**/}&nbsp;&nbsp;
                    {/* <button className='text-center btn btn-info' > */}
                    <Link to="/admin/Watch" className="btn btn-info">Play</Link>
                    {/* </button> */}
                    {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}

                  </div>

                  {/* </form> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAud;
