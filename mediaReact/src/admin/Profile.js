import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../Config';

const Profile = () => {
  // ---------------------Admin functions -------------------------------
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    // Fetch user data from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v2/GetAllUser`);
        setUsers(response.data.userList);
        console.log(response.data.userList)
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

       fetchUsers();
        }, []);
        



    const handleDeleteUser = (userId) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          // Perform the actual deletion logic here
          console.log(`Deleting user with ID: ${userId}`);
    
          // Make an API call to delete the user
          fetch(`${API_URL}/api/v2/DeleteUser/${userId}`, {
            method: 'DELETE',
          })
            .then((response) => {
              if (response.ok) {
                console.log('User deleted successfully');
                Swal.fire({
                  title: 'Deleted!',
                  text: 'User has been deleted.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                });
    
                // Remove the deleted user from the local state
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
              } else {
                console.log('Error deleting user');
                Swal.fire({
                  title: 'Error!',
                  text: 'Error deleting user',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              }
            })
            .catch((error) => {
              console.log('Error deleting user:', error);
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting user. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            });
        }
      });
    };
    const handlEdit = async (userId) => {
      localStorage.setItem('items',userId);
      navigate('/admin/EditComponent');
    };

  return (

    <div className="marquee-container">
  <div className='AddArea'>
    <Link to="/admin/AddUser">
      <button className='btn btn-custom'>Add SubAdmin</button>
    </Link>
  </div>
  <br/>
  {/* <Sample /> */}
  <div className='container3 '>
    <ol className="breadcrumb mb-4 d-flex my-0">
      <li className="breadcrumb-item text-white">
        Manage SubAdmin
      </li>
      <li className="ms-auto text-end text-white">
        Bulk Action
        <button className="ms-2">
          <i className="bi bi-chevron-down"></i>
        </button>
      </li>
    </ol>
    <div class="outer-container">
    <div className="table-container">
      <table className="table table-striped ">
        <thead>
          <tr className='table-header'>
            <th style={{border: 'none' }}>
              <input type="checkbox" />
            </th>
            <th style={{border: 'none' }}>S.No</th>
            <th style={{border: 'none' }}>User Name</th>
            <th style={{border: 'none' }}>Mobile Number</th>
            <th style={{border: 'none' }}>Address</th>
            <th style={{border: 'none' }}>Pincode</th>
            <th style={{border: 'none' }}>Email</th>
            <th style={{border: 'none' }}>Company Name</th>
            <th style={{border: 'none' }}>Country</th>
            <th style={{border: 'none' }}>Action</th>
          </tr> 
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.mobnum}</td>
              <td>{user.address}</td>
              <td>{user.pincode}</td>
              <td>{user.email}</td>
              <td>{user.compname}</td>
              <td>{user.country}</td>
              <td>
                <button onClick={() => handlEdit(user.id)} className="btn btn-primary me-2">
                  <i className="fas fa-edit" aria-hidden="true"></i>
                </button>
                <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger">
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

export default Profile;