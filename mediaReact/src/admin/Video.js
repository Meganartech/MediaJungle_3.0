import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../csstemp/VideoStyle.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API_URL from '../Config';
// import '../csstemp/VideoStyle.css';
import "../css/Sidebar.css";

const Video = () => {
  // ------------------------------ Admin Functions  -----------------------------------------
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const userid = parseInt(sessionStorage.getItem('id'), 10); // Get user ID from session storage
  const name = sessionStorage.getItem('username');
  const [users, setUsers] = useState([]);
  let Id;
  const navigate = useNavigate();
  const [dataToSend, setDataToSend] = useState('');
  const [paid, setpaid] = useState('');
  const token= sessionStorage.getItem('tokenn')

  const handleClick = (link) => {
    navigate(link);
  }



  useEffect(() => {
    // Fetch videos from the backend API
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v2/videogetall`);
        setUsers(response.data);  
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  
  

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/api/videogetall`);
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.log('Error fetching users:', error);
  //   }
  // };
  const handleDelete = async (audioId) => {
    const audId = audioId;
    console.log(audId);
  
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/api/video/${audId}`, {
            method: 'DELETE',
            headers:{
              Authorization:token,
            }
          });
  
          if (response.ok) {
            // fetchAudios();
            // setDeleteStatus('Audio deleted successfully');
            // setGetall((prevGetAll) => {
            //   const updatedGetAll = [...prevGetAll];
            //   updatedGetAll.splice(index, 1);
            //   return updatedGetAll;
            // });
            // fetchUsers();
            console.log('deleteStatus');
            Swal.fire(
              'Deleted!',
              'The video has been deleted.',
              'success'
            );
          } else {
            // setDeleteStatus('Error deleting audio');
            console.log('deleteStatus');
            Swal.fire(
              'Error!',
              'There was a problem deleting the video.',
              'error'
            );
          }
        } catch (error) {
          console.error('Error:', error);
          // setDeleteStatus('Error deleting audio');
          console.log("deleteStatus");
          Swal.fire(
            'Error!',
            'There was a problem deleting the video.',
            'error'
          );
        }
      }
    });
  };

  const handlEdit = async (audioId) => {
    localStorage.setItem('items', audioId);
    navigate('/admin/EditVideo');
  };
  
  
// ------------------------------ User Functions ----------------------------------------------
 

  return (

    <div className="marquee-container">
        <div className='AddArea'>
          <button className='btn btn-custom' onClick={() => handleClick("/admin/AddVideo")}>Add Video</button>
        </div><br/>
      <div className='container2'>
      <ol className="breadcrumb">
        <li className="breadcrumb-item text-white">Videos
        </li>
       
      </ol>
    
         
            <div className="card-body profile-card-body">
              <table id="datatablesSimple">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Movie Name</th>
                    <th>Description</th>
                    <th>Tags</th>
                    <th>Category</th>
                    <th>Certificate</th>
                    <th>Language</th>
                    <th>Duration</th>
                    <th>Year</th>
                    <th>Paid</th>
                    <th>Action</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.moviename}</td>
                      <td>{user.description}</td>
                      <td>{user.tags}</td>
                      <td>{user.category}</td>
                      <td>{user.certificate}</td>
                      <td>{user.language}</td>
                      <td>{user.duration}</td>
                      <td>{user.year}</td>
                      <td>{user.paid===true ? 1 : 0}</td>
                      <td>
                        
                        <button onClick={() => handlEdit(user.id)} >
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        </button>
                        <button onClick={() => handleDelete(user.id)} >
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

export default Video;
