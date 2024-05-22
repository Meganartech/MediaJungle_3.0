import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const ViewLanguage = () => {
  //.......................................Admin functiuons.....................................
  const userid = parseInt(sessionStorage.getItem('id'), 10); // Get user ID from session storage
  const name = sessionStorage.getItem('username');
  const navigate = useNavigate();
  let Id;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState('');
  const [language, setlanguage] = useState([]);
  const userid_u =sessionStorage.getItem('id');
  const [showConfirmation_u, setShowConfirmation_u] = useState(false);
  const [categoryIdToDelete_u, setCategoryIdToDelete_u] = useState('');
  const [categories_u, setCategories_u] = useState([]);

  // useEffect(() => {
  //   // Fetch category data from the backend
  //   fetch('http://localhost:8080/api/v2/GetAllCategories')
  //     .then(response => response.json())
  //     .then(data => setCategories(data))
  //     .catch(error => console.log(error));
  // }, []);

  useEffect(() => {
    // fetch category data from the backend
    fetch(`${API_URL}/api/v2/GetAllLanguage`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setlanguage(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // const handleDeleteCategory = (categoryId) => {
  //   setShowConfirmation(true);
  //   setCategoryIdToDelete(categoryId);
  // };

  const handleDeleteLanguage = (languageId) => {
    fetch(`${API_URL}/api/v2/DeleteLanguage/${languageId}`, {
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
      if (!data) {
        console.log('Language deleted successfully');
        // Remove the deleted language from the local state
        setlanguage(prevLanguages => prevLanguages.filter(language => language.id !== languageId));
      } else {
        console.error('Error deleting language:', data.error); // Log error message from server
      }
    })
    .catch(error => {
      console.error('Error deleting language:', error);
    });
  };
  

  const handlEdit = async (languageId) => {
    localStorage.setItem('items', languageId);
    navigate('/admin/Editlanguage');
  };
  
  return (
    
  <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

      
        <Sidebar />
      <div className="container-fluid">
<div className='container2'>
        <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
        </li>
          <li className="breadcrumb-item active">View Languages</li>
        </ol>
         
          <div className="card-body">
            <table id="datatablesSimple">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Languages</th>
                </tr>
              </thead>
              <tbody>
                {language.map((lang, index) => (
                  <tr key={lang.id}>
                    <td>{index + 1}</td>
                    <td>{lang.language ? lang.language : 'No category available'}</td>
                    <td>
                  <button onClick={() => handlEdit(lang.id)} >
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        
                  </button>
                        <button onClick={() => handleDeleteLanguage(lang.id)}>
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
    </div>
  );
};

export default ViewLanguage;
