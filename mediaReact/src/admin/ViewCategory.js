 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';
import Swal from 'sweetalert2';

const ViewCategory = () => {
  //.......................................Admin functiuons.....................................
  
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();



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
    

      <div className="container-fluid">
   
     <div className='container2'>
        <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
        </li>
          <li className="breadcrumb-item active">View Categories</li>
        </ol>
        {/* {
          name=="admin"
          ? */}
        
          <div className="card-body">
            <table id="datatablesSimple">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Categories</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.categories ? category.categories : 'No category available'}</td>
                    <td>
                    <button onClick={() => handlEdit(category.id)} >
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        
                  </button>
                        <button onClick={() => handleDeleteCategory(category.id)}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
     
        </div>
        
      </div>
    </div>
 
  );
};

export default ViewCategory;
