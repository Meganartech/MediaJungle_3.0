import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
// import '../csstemp/addVideo.css';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';


const AddCertificate = () => {
  const [certificateName, setCertificateName] = useState(null);
  const [SuccessMessage , setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  // const name=sessionStorage.getItem('username');

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const formData = new FormData();
      // formData.append('file', file);

      const data ={
        certificate : certificateName
      };
      console.log(data)

      // Use axios for the file upload
      const response = await axios.post(`${API_URL}/api/v2/AddCertificate`, data,{
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      if (response.data) {
        setSuccessMessage('certificate inserted successfully!');
      } else {
        setError('Error occurred while inserting certificate.');
      }
      setCertificateName(null);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('File upload failed');
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);
  
  //     const response = await fetch('http://localhost:8080/api/v2/AddCertificate', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       // Check for error response
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  
  //     const data = await response.json();
  //     console.log(data);
  //     setFile(null);
  //     setError(null);
  //   } catch (error) {
  //     console.error(error);
  //     setError('File upload failed');
  //   }
  // };
  


  return (
    <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

<Sidebar />
    <div className='container-fluid'>
<div className='container2'>
          <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
          </li>
            <li className="breadcrumb-item active">Add Certificate</li>
          </ol>
      <div className='temp justify-content-center'>
        <div className='col-lg-12'>
          {/* {name==="admin"
          ? */}
     
            <div className='card-body'>
              {error && (
                <div className='alert alert-danger'>{error}</div>
              )}
              {SuccessMessage && (
                <div className='alert alert-success'>{SuccessMessage}</div>
              )}
            <div className='card-body'>
              <form className='form-container' onSubmit={handleSubmit}>
                  <h5 className='modal-title modal-header'  style={{fontFamily:'Poppins'}} id='exampleModalLongTitle'>
                    Add Certificate
                  </h5>
                  <div className='modal-body text-center'>
                  <input
                    type='text'
                    name='category_name'
                    className='form-control'
                    id='name'
                    required
                    placeholder=''
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                  />
                  <br />
                </div>
                <div className='modal-footer'>
                  <input
                    type='submit'
                    name='but_upload'
                    value='Save'
                    className='btn btn-info'
                  />
                </div>
              </form>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};

export default AddCertificate;