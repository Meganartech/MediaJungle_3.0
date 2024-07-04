import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const ViewTag = () => {
     const navigate = useNavigate();
  const [Tag, setTag] = useState([]);

  useEffect(() => {
    // fetch category data from the backend
    fetch(`${API_URL}/api/v2/GetAllTag`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTag(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);



const handleDeleteTag = (tagId) => {
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
      fetch(`${API_URL}/api/v2/DeleteTag/${tagId}`, {
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
          console.log('Tag deleted successfully', data);
        } else {
          console.log('Tag deleted successfully (no content)');
        }
        // Remove the deleted tag from the local state
        setTag(prevTag => prevTag.filter(tag => tag.id !== tagId));
        Swal.fire(
          'Deleted!',
          'Your tag has been deleted.',
          'success'
        );
      })
      .catch(error => {
        console.error('Error deleting tag:', error);
        Swal.fire(
          'Error!',
          'There was a problem deleting your tag. Please try again later.',
          'error'
        );
      });
    }
  });
};


  const handlEdit = async (tagId) => {
    localStorage.setItem('items', tagId);
    navigate('/admin/EditTag');
  };



  return (
      
        <div className="container-fluid">
        <div className='container2'>
          <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
          </li>
            <li className="breadcrumb-item active">View Tags</li>
          </ol>
         
       
            <div className="card-body">
              <table id="datatablesSimple">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>&nbsp;&nbsp;Tags</th>
                  </tr>
                </thead>
  
                <tbody>
                {Tag.map((tag, index) => (
                  <tr key={tag.id}>
                    <td>{index + 1}</td>
                    <td>{tag.tag}</td>
                    <td>&nbsp;&nbsp;
                       
                        <button onClick={() => handlEdit(tag.id)} >
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        
                      </button>
                      <button onClick={() => handleDeleteTag(tag.id)}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>            </table>
              </div>
              </div>
        </div>
  
    );
  };

export default ViewTag;
