import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
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
        // Remove the deleted category from the local state
        setTag(prevTag => prevTag.filter(tag => tag.id !== tagId));
      })
      .catch(error => {
        console.error('Error deleting Tag:', error);
      });
  };

  const handlEdit = async (tagId) => {
    localStorage.setItem('items', tagId);
    navigate('/admin/EditTag');
  };



  return (
      
  <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

        <Sidebar />
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
        </div>
  
    );
  };

export default ViewTag;
