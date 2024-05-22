import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-audio-player';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const ListAudio = () => {
  const [image, setImage] = useState([]);
  const [vimage, setvImage] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [filename, setFilename] = useState(null);
  const [getall, setGetall] = useState(null);
  const [all, setall] = useState(null);
  const userid = parseInt(sessionStorage.getItem('id'), 10);
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
    fetch(`${API_URL}/api/v2/audio/${audioId}`,{
      method:'DELETE',
    })
    .then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.status === 200 ? {} : response.json();
})
.then(data => {
  if (data) {
    console.log('audio deleted successfully', data);
  } else {
    console.log('audio deleted successfully (no content)');
  }
  setGetall(prevCategories => prevCategories.filter(audio => audio.id !== audioId));
})

    .catch(error => {
      console.error('Error deleting category:', error);
    });
  };

  const handlEdit = async (audioId) => {
    localStorage.setItem('items', audioId);
    navigate('/admin/Editaudio');
  };
  
  return (
    <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: '13rem' }}>
      <Sidebar />
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
            {getall && getall.length > 0 && (
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
                      </tr>
                    </thead>
                    <tbody>
                      {getall.map((audio, index) => (
                        <tr key={audio.id}>
                          <td>{index + 1}</td>
                          <td>{audio.fileName.replace(/^.*[\\\/]/, '').replace(/^.*_/, '').replace(/\.mp3$/, '')}</td>
                          <td>{audio.category.categories}</td>
                          <td>
                            <button onClick={() => handlEdit(audio.id)}>
                              <i className="fas fa-edit" aria-hidden="true"></i>
                            </button>
              
                            <button onClick={() => handleDelete(audio.id)}>
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAudio;
