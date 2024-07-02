import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';
import Swal from 'sweetalert2';

const AddTag = () => {
   //.......................................Admin functiuons.....................................
   const name=sessionStorage.getItem('username');
  const [tagName, setTagName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



const handleSubmit = (e) => {
  e.preventDefault();

  const data = {
    tag: tagName
  };
  console.log(data);

  // Send the tag name to the server using a POST request
  fetch(`${API_URL}/api/v2/AddTag`, {
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
      setTagName('');

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Tag inserted successfully!',
      });
    } else {
      setErrorMessage('Error occurred while inserting tag.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error occurred while inserting tag.',
      });
    }
  })
  .catch(error => {
    setErrorMessage('Error occurred while inserting tag.');
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while inserting the tag.',
    });
  });
};

  return (

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
                    </div>
        
        </div> 
      </div>
    </div>

      );
};

export default AddTag;
