import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';
import Swal from 'sweetalert2';

const ViewCategory = () => {
  //.......................................Admin functiuons.....................................
  
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('tokenn')



  useEffect(() => {
    // fetch category data from the backend
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
  }, []);
  const handleClick = (link) => {
    navigate(link);
  }

  

const handleDeleteCategory = (categoryId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${API_URL}/api/v2/DeleteCategory/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
      }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // If the response status is OK, don't attempt to parse JSON from an empty response
        return response.status === 204 ? null : response.json();
      })
      .then(data => {
        if (data) {
          console.log('Category deleted successfully', data);
        } else {
          console.log('Category deleted successfully (no content)');
        }
        // Remove the deleted category from the local state
        setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );
      })
      .catch(error => {
        console.error('Error deleting category:', error);
        Swal.fire(
          'Error!',
          'There was a problem deleting your category. Please try again later.',
          'error'
        );
      });
    }
  });
};

  const handlEdit = async (categoryId) => {
    localStorage.setItem('items', categoryId);
    navigate('/admin/EditCategory');
  };
  

  return (
    

    <div className="marquee-container">
    <div className='AddArea'>
      <button className='btn btn-custom' onClick={() => handleClick("/admin/AddCategory")}>Add Categories</button>
    </div><br/>
    
    <div className='container3'>
      <ol className="breadcrumb mb-4 d-flex  my-0">
        <li className="breadcrumb-item text-white">Categories</li>
        <li className="ms-auto text-end text-white">
          Bulk Action
          <button className="ms-2">
            <i className="bi bi-chevron-down"></i>
          </button>
        </li>
      </ol>
      <div class="outer-container">
      <div className="table-container">
      <table class="table table-striped">
          <thead>
            <tr className='table-header'>
              < th style={{border: 'none' }}>
                <input type="checkbox" />
              </th>
              <th style={{border: 'none' }}>S.NO</th>
              <th style={{border: 'none' }}>CATEGORY NAME</th>
              <th style={{border: 'none' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{index + 1}</td>
                <td>{category.categories ? category.categories : 'No category available'}</td>
                <td>
                  <button onClick={() => handlEdit(category.id)} className="btn btn-primary me-2">
                    <i className="fas fa-edit" aria-hidden="true"></i> Edit
                  </button>
                  
                  <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-danger">
                    <i className="fa fa-trash" aria-hidden="true"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
 
  

 
  );
};

export default ViewCategory;

