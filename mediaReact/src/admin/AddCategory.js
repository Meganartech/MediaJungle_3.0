import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const AddCategory = () => {
  
    //.....................................Admin Function............................................
  const [categoryName, setCategoryName] = useState('');
  const token = sessionStorage.getItem("tokenn")


  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create the data object
    const data = {
      categories: categoryName
    };
  
    console.log(data);
  
    // Send the category name to the server using a POST request
    fetch(`${API_URL}/api/v2/AddNewCategories`, {
      method: 'POST',
      headers: {
        Authorization: token, // Pass the token in the Authorization header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      if (data === 'success') {
        setCategoryName('');
  
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category inserted successfully!',
        });
      } else {
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error occurred while inserting category.',
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error occurred while inserting category.',
      });
    });
  };
  

  return (
    
    <div className='container3 mt-20'>
   <ol className="breadcrumb mb-4 d-flex my-0">
    <li className="breadcrumb-item"><Link to="/admin/ViewCategory">Categories</Link></li>
    <li className="breadcrumb-item active text-white">Add Categories</li>
  </ol>
  
  {/* <div className="container mt-3"> */}
  <div class="outer-container">
    <div className="table-container">
    <div className="row py-3 my-3 align-items-center w-100">
      <div className="col-md-3">
        <label className="custom-label">Category Name</label>
      </div>
      <div className="col-md-4">
        <input 
          type='text'
          name='category_name'
          id='name'
          required
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="form-control border border-dark border-2" 
          placeholder="Enter Category" 
        />
      </div>
    </div>

    <div className="row py-3 my-5 w-100">
      <div className="space" ></div> 
    </div>
    <div className="row py-3 my-5 w-100">
      <div className="col-md-8 ms-auto text-end">
      <button className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg ">Cancel</button>
        <button className="border border-dark border-2 p-1.5 w-20 mr-10 text-white rounded-lg " onClick={handleSubmit} style={{backgroundColor:'blue'}}
        >Submit</button>
      </div>
    </div>
  </div>
</div>
</div>

  );
};

export default AddCategory;

