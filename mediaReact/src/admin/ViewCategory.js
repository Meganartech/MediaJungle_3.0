 import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const ViewCategory = () => {
  //.......................................Admin functiuons.....................................
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState('');
  const [categories, setCategories] = useState([]);
  const userid_u =sessionStorage.getItem('id');
  const [showConfirmation_u, setShowConfirmation_u] = useState(false);
  const [categoryIdToDelete_u, setCategoryIdToDelete_u] = useState('');
  const [categories_u, setCategories_u] = useState([]);
  const userid = parseInt(sessionStorage.getItem('id'), 10); // Get user ID from session storage
  const name = sessionStorage.getItem('username');
  const navigate = useNavigate();
  let Id;
  const [dataToSend, setDataToSend] = useState('');
  const [items, setItems] = useState([]);


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
      })
      .catch(error => {
        console.error('Error deleting category:', error);
      });
  };

  const handlEdit = async (categoryId) => {
    localStorage.setItem('items', categoryId);
    navigate('/admin/EditCategory');
  };
  


  
  //.......................................User functiuons.....................................
  useEffect(() => {
    // fetch category data from the backend
    fetch(`${API_URL}/api/v2/GetAllCategories`)
      .then(response => response.json())
      .then(data => setCategories_u(data))
      .catch(error => console.log(error));
  }, []);

  


  
  return (
    
  <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

         <Sidebar />
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
                    
                    {/* <Link
                      to={{
                        pathname: "/admin/EditCategory",
                        state: { category },
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </Link> */}
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
        {/* :
         <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
            Categories-u
          </div>
          <div className="card-body">
            <table id="datatablesSimple">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Categories</th>
                </tr>
              </thead>
              <tbody>
                {categories_u.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.category_name}</td>
                    <td>
                      <button>
                        <Link
                          to={{
                            pathname: `/EditCategory`,
                            state: { category },
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                      </button>
                      <button onClick={() => {
                        if (window.confirm('Do you really want to delete this category?')) {
                          confirmDeleteCategory_u();
                        }
                      }}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        }
         */}
      </div>

      {/* Confirmation dialog
      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h3>Confirmation</h3>
            <p>Do you really want to delete this category?</p>
            <div className="confirmation-buttons">
              <button onClick={confirmDeleteCategory}>Yes</button>
              <button onClick={() => setShowConfirmation(false)}>No</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
    </div>
  );
};

export default ViewCategory;
