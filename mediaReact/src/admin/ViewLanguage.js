import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const ViewLanguage = () => {

  const navigate = useNavigate();
  const [language, setlanguage] = useState([]);


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





const handleDeleteLanguage = (languageId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this language. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    if (result.isConfirmed) {
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
          Swal.fire(
            'Deleted!',
            'Your language has been deleted.',
            'success'
          );
        } else {
          console.error('Error deleting language:', data.error); // Log error message from server
          Swal.fire(
            'Error!',
            `Failed to delete language: ${data.error}`,
            'error'
          );
        }
      })
      .catch(error => {
        console.error('Error deleting language:', error);
        Swal.fire(
          'Error!',
          'There was a problem deleting your language. Please try again later.',
          'error'
        );
      });
    }
  });
};


  const handlEdit = async (languageId) => {
    localStorage.setItem('items', languageId);
    navigate('/admin/Editlanguage');
  };
  
  return (
    

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
   
  );
};

export default ViewLanguage;
