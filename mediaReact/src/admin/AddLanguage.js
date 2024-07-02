import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';


const AddLanguage = () => {
  
    //.....................................Admin Function............................................
    const name=sessionStorage.getItem('username');
  const [languageName, setlanguageName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



const handleSubmit = (e) => {
  e.preventDefault();

  const data = {
    language: languageName
  };
  console.log(data);

  // Send the language name to the server using a POST request
  fetch(`${API_URL}/api/v2/AddLanguage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    if (data === 'success') {
      setlanguageName('');
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Language inserted successfully!',
      });
    } else {
      setErrorMessage('Error occurred while inserting language.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error occurred while inserting language.',
      });
    }
  })
  .catch(error => {
    setErrorMessage('Error occurred while inserting language.');
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while inserting the language.',
    });
  });
};

  
  //   //.....................................User Function............................................
  //   const userid =sessionStorage.getItem('id');
  // const [categoryName_u, setCategoryName_u] = useState('');
  // const [errorMessage_u, setErrorMessage_u] = useState('');
  // const [successMessage_u, setSuccessMessage_u] = useState('');

  // const handleSubmit_u = (e) => {
  //   e.preventDefault();

  //   // Create form data object
  //   // const formData = new FormData();
  //   // formData.append('category_name', categoryName_u);

  //   // console.log(categoryName_u);
  //   // Send the category name to the server using a POST request
  //   fetch(`${API_URL}/api/v2/AddNewCategories`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: new URLSearchParams(formData),
  //   })
    
  //     .then(response => response.text())
  //     .then(data => {
  //       if (data === 'success') {
  //         setSuccessMessage_u('Category inserted successfully!');
  //         setCategoryName_u('');
  //       } else {
  //         setErrorMessage_u('Error occurred while inserting category.');
  //       }
  //     })
  //     .catch(error => {
  //       setErrorMessage_u('Error occurred while inserting category.');
  //       console.error('Error:', error);
  //     });
  // };

  return (
   
    <div className='container-fluid'>      
<div className='container2'>
          <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
          </li>
            <li className="breadcrumb-item active">Add Language</li>
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
                <div className='modal-header'>
                  <h5 className='modal-title' style={{fontFamily:'Poppins'}}id='exampleModalLongTitle'>
                    Add New Language
                  </h5>
                </div>
                <div className='modal-body text-center'>
                  <input
                    type='text'
                    name='category_name'
                    className='form-control'
                    id='name'
                    required
                    placeholder=''
                    value={languageName}
                    onChange={(e) => setlanguageName(e.target.value)}
                  />
                  <br />
                </div>
                <div className='modal-footer'>
                  <input
                    type='submit'
                    name='but_upload'
                    value='Add'
                    className='btn btn-info'
                  />
                </div>
              </form>
            </div>
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
   
    
    // </div>
  );
};

export default AddLanguage;
