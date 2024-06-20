import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';
import "../css/Sidebar.css";
import { useNavigate } from 'react-router-dom';
import API_URL from '../Config';

const SubscriptionPayments = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v2/GetAllUsers`);
        setUsers(response.data);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Do you really want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${API_URL}/api/v2/DeleteUser/${userId}`);
        if (response.status === 200) {
          console.log('User deleted successfully');
          // Remove the deleted user from the local state
          setUsers(users.filter((user) => user.id !== userId));
        } else {
          console.log('Error deleting user');
        }
      } catch (error) {
        console.log('Error deleting user:', error);
      }
    }
  };

  return (
    
      <div className="container-fluid">
        <div className='container2'>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item text-white">
              <Link to="/Dashboard">SubscriptionPayments</Link>
            </li>
            <li className="breadcrumb-item active">userdetails</li>
          </ol>
          <div className="card-body profile-card-body">
            <table id="datatablesSimple">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Name</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.mobnum}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No users found</td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
   
  );
};

export default SubscriptionPayments;
