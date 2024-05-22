import React, { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';
const AddTag = () => {
   //.......................................Admin functiuons.....................................
   const name=sessionStorage.getItem('username');
  const [tagName, setTagName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create form data object
    // const formData = new FormData();
    // formData.append('categories', categoryName);

    // console.log(formData);
    const data = {
      tag: tagName
    };
    console.log(data)
    // Send the category name to the server using a POST request
    fetch(`${API_URL}/api/v2/AddTag`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})

    
      .then(response => response.text())
      
      .then(data => {
        console.log(data)
        if (data === 'success') {
          setSuccessMessage('Tag inserted successfully!');
          setTagName('');
        } else {
          setErrorMessage('Error occurred while inserting tag.');
        }
      })
      .catch(error => {
        setErrorMessage('Error occurred while inserting tag.');
        console.error('Error:', error);
      });
      
  };
  
   //.......................................User functiuons.....................................
  // const userid_u =sessionStorage.getItem('id');
  // const [tagName_u, setTagName_u] = useState('');
  // const [errorMessage_u, setErrorMessage_u] = useState('');
  // const [successMessage_u, setSuccessMessage_u] = useState('');

  // const handleSubmit_u = (e) => {
  //   e.preventDefault();

  //   // Create form data object
  //   const formData = new FormData();
  //   formData.append('tag_name', tagName_u);

  //   console.log(tagName_u);
  //   // Send the Tag name to the server using a POST request
  //   fetch('http://localhost/mediareact/src/php/AddTag.php', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: new URLSearchParams(formData),
  //   })
    
  //     .then(response => response.text())
  //     .then(data => {
  //       if (data === 'success') {
  //         setSuccessMessage_u('Tag inserted successfully!');
  //         setTagName_u('');
  //       } else {
  //         setErrorMessage_u('Error occurred while inserting Tag.');
  //       }
  //     })
  //     .catch(error => {
  //       setErrorMessage_u('Error occurred while inserting Tag.');
  //       console.error('Error:', error);
  //     });
  // };

  return (
    <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

     <Sidebar />
    <div className='container-fluid'>
    <div className='container2'>
          <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
          </li>
            <li className="breadcrumb-item active">Add Tag</li>
          </ol>
      <div className='temp justify-content-center'>
        <div className='col-lg-12'>
          {/* {name=="admin"
          ? */}
         
         <div className='card-body'>
           
           
              {errorMessage && (
                <div className='alert alert-danger'>{errorMessage}</div>
              )}
              {successMessage && (
                <div className='alert alert-success'>{successMessage}</div>
              )}
              <form onSubmit={handleSubmit}>
               
                <div className='modal-body text-center'>
                <h5 className='modal-title modal-header'  style={{fontFamily:'Poppins'}} id='exampleModalLongTitle'>
                    Add Tag
                  </h5>
                  <input
                    type='text'
                    name='Tag'
                    className='form-control'
                    id='Tag'
                    required
                    placeholder='Tag Name'
                    onChange={(e) =>  setTagName(e.target.value)}
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
          {/* : */}
          {/* <div className='card shadow-lg border-0 rounded-lg mt-5'> 
            <div className='card-header'>
              <h2 className='text-center'>Add user Categories</h2>
              <hr />
            </div> */}
            {/* <div className='card-body'>
              {errorMessage_u && (
                <div className='alert alert-danger'>{errorMessage_u}</div>
              )}
              {successMessage_u && (
                <div className='alert alert-success'>{successMessage_u}</div>
              )}
              <form onSubmit={handleSubmit_u}>
                <div className='modal-header bg-info'>
                  <h5 className='modal-title' id='exampleModalLongTitle'>
                    Add New Categories
                  </h5>
                </div>
                <div className='modal-body text-center'>
                  <input
                    type='text'
                    name='category_name'
                    className='form-control'
                    id='name'
                    required
                    placeholder='Category Name'
                    value={categoryName_u}
                    onChange={(e) => setCategoryName_u(e.target.value)}
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
            </div>*/}
          </div>
          {/* } */}
        </div> 
      </div>
    </div>
    </div>

      );
};

export default AddTag;
