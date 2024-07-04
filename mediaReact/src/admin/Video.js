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





  useEffect(() => {
    // Fetch videos from the backend API
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/videogetall`);
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
            method: 'DELETE'
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

    <div className="container-fluid">
      <div className='container2'>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item active">Videos</li>
      </ol>
    
          {/* {name === 'admin' 
          ? */}
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
                        {/* <Link
                          to={{
                            pathname: `/admin/EditVideo`,
                            state: { user },
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Link> */}
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
          {/* : 
          <div className="card-body">
          <form onSubmit={handleSubmit} method='POST'>
            <div className="user-details">
              <label>User ID:</label>
              <span>{id}</span>
            </div>
            <div className="user-details">
              <label>Username:</label>
              <input type="text" name="username" value={username} onChange={handleChange} />
            </div>
            <div className="user-details">
              <label>Mobile Number:</label>
              <input type="text" name="mobnum" value={mobnum} onChange={handleChange} />
            </div>
            <div className="user-details">
              <label>Address:</label>
              <input type="text" name="address" value={address} onChange={handleChange} />
            </div>
            <div className="user-details">
              <label>Pincode:</label>
              <input type="text" name="pincode" value={pincode} onChange={handleChange} />
            </div>
            <div className="user-details">
              <label>Email:</label>
              <input type="text" name="email" value={email} onChange={handleChange} />
            </div>
            <div className="user-details">
              <label>Company Name:</label>
              <input type="text" name="compname" value={compname} onChange={handleChange} />
            </div>
            <div className="user-details">
              <label>Country:</label>
              <input type="text" name="country" value={country} onChange={handleChange} />
            </div>
            <div className="user-details">
              <label>Password:</label>
              <input type="password" name="password" value={password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-info">Save Changes</button>
          </form>
        </div>
          } */}
        </div>
    </div>

  );
};

export default Video;
