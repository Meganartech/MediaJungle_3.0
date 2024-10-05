import React, { useEffect, useState } from 'react'
import Usersidebar from './usersidebar'
import Footer from './Footer'
import Layout from './Layout/Layout'
import API_URL from '../Config';
import { FaBell, FaKey, FaPen, FaUserEdit } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

function Subscription_details() {
  const name = sessionStorage.getItem("name");
  const jwtToken = sessionStorage.getItem("token");
  const userId = Number(sessionStorage.getItem("userId")); // Convert to number

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [getall, setGetAll] = useState('');

  useEffect(() => {
      if (!jwtToken) {
          setLoading(false); // If no token, don't make the fetch request
          return;
      }

      fetch(`${API_URL}/api/v2/GetUserById/${userId}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Failed to fetch user');
              }
              return response.json();
          })
          .then(data => {
              setUser(data);
              console.log(data);
              setLoading(false);
          })
          .catch(error => {
              setError(error.message);
              setLoading(false);
          });
  }, [jwtToken, userId]);

  useEffect(() => {
      fetch(`${API_URL}/api/v2/GetsiteSettings`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              setGetAll(data);
              console.log(data);
          })
          .catch(error => {
              console.error('Error fetching data:', error);
          });
  }, []);

  if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  return (
    <Layout className='container mx-auto min-h-screen overflow-y-auto'>
        <div> {jwtToken && user ? <h1  className='ml-4 text-xl font-medium text-white' >Welcome    {user.username}      !!</h1> : "Welcome User"}</div>
    <div className='px-10 my-24 flex flex-col items-left' style={{paddingLeft:'500px'}}>
      
 
        {/* Separate div for User Information */}
        <div>
            {jwtToken && user ? (
                <>
                    <div className="mb-6">
                        <label className="flex text-yellow-600 text-lg font-medium">
                            <span className="ml-4 text-lg font-medium text-gray-500">Subscription Plan  :  </span>
                        </label>
                    </div>
                    <div className="mb-6">
                        <label className="flex text-yellow-600 text-lg font-medium mb-2">
                            <span className="ml-4 text-lg font-medium text-gray-500"></span>
                        </label>
                    </div>
                   
                </>
            ) : (
                <NavLink to='/UserLogin' className='bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full text-center'>
                    <FiLogIn /> Sign In
                </NavLink>
            )}
        </div>
    </div>
</Layout>
  )
}

export default Subscription_details