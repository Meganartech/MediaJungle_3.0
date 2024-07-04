import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';
import Swal from 'sweetalert2';

const ListAudio = () => {

  const [getall, setGetall] = useState(null);
  const name = sessionStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAll`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetall(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDelete = (audioId) => {
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
        fetch(`${API_URL}/api/v2/audio/${audioId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.status === 200 ? {} : response.json();
        })
        .then(data => {
          if (data) {
            console.log('Audio deleted successfully', data);
          } else {
            console.log('Audio deleted successfully (no content)');
          }
          setGetall(prevCategories => prevCategories.filter(audio => audio.id !== audioId));
          Swal.fire(
            'Deleted!',
            'Your audio has been deleted.',
            'success'
          );
        })
        .catch(error => {
          console.error('Error deleting audio:', error);
          Swal.fire(
            'Error!',
            'There was a problem deleting your audio. Please try again later.',
            'error'
          );
        });
      } else {
        Swal.fire(
          'Cancelled',
          'Your audio is safe :)',
          'error'
        );
      }
    });
  };

  const handlEdit = async (audioId) => {
    localStorage.setItem('items', audioId);
    navigate('/admin/Editaudio');
  };
  
  return (
      <div className="container-fluid">
        <div className='container2'>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item text-white">
              <Link to="/Dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Audios</li>
          </ol>

          <h1 className="mt-4 text-white">{name === "admin" ? "Admin-Audios" : "User-Audios"}</h1>

          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            
              <div className="card-1 mb-4" style={{ height: "auto" }}>
                <div className="card-header">
                  <i className="fas fa-table me-1"></i>
                  Audio List
                </div>
                <div className="card-body profile-card-body">
                  <table id="datatablesSimple">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>songname</th>
                        <th>category</th>
                        <th>Paid</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {getall && getall.length > 0 && (
                      getall.map((audio, index) => (
                        <tr key={audio.id}>
                          <td>{index + 1}</td>
                          <td>{audio.fileName.replace(/^.*[\\\/]/, '').replace(/^.*_/, '').replace(/\.mp3$/, '')}</td>
                          <td>{audio.category.categories}</td>
                          <td>{audio.paid===true?1:0}</td>
                          <td>
                            <button onClick={() => handlEdit(audio.id)}>
                              <i className="fas fa-edit" aria-hidden="true"></i>
                            </button>
              
                            <button onClick={() => handleDelete(audio.id)}>
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                          </td>
                        </tr>
                      )) )}
                      
                     
                    </tbody>
                  </table>
                </div>
              </div>
          
          </div>
        </div>
      </div>
  
  );
};

export default ListAudio;
