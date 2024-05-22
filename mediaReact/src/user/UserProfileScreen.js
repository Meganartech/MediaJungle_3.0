import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation
import Layout from './Layout/Layout';
import { FiLogIn } from 'react-icons/fi';
import API_URL from '../Config';

const UserProfileScreen = () => {
    // Retrieve user information from session storage
    const name = sessionStorage.getItem("name");
    const jwtToken = sessionStorage.getItem("token");
    const userId = Number(sessionStorage.getItem("userId")); // Convert to number

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
    }, [jwtToken, userId]);

    // If loading, display loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // If error, display error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Layout className='container mx-auto min-h-screen overflow-y-auto'>
            <div className='px-10 my-24 flex justify-center'>
                <div >
                    <img
                        src='/images/logo.png'
                        alt='logo'
                        className='w-full h-12 object-contain mb-8'
                    />
                    {/* Conditionally render user information if logged in */}
                    {jwtToken && user && (
                        <>
                            <div className="mb-6">
                                <label className="block text-yellow-600 text-lg font-medium mb-2">Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-lg font-medium text-gray-500">{user.username}</span></label>
                                
                            </div>
                            <div className="mb-6">
                                <label className="block text-yellow-600 text-lg font-medium mb-2">Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-lg font-medium text-gray-500">{user.email}</span></label>
                                
                            </div>
                            <div className="mb-6">
                                <label className="block text-yellow-600 text-lg font-medium mb-2">Password:&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-lg font-medium text-gray-500">{user.password}</span></label>
                                
                            </div>
                        </>
                    )}
                    {/* If not logged in, display login button */}
                    <br />
                    {!jwtToken && (
                        <NavLink to='/UserLogin' className='bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full'>
                           <FiLogIn />Sign In
                        </NavLink>
                    )}
                </div>
            </div>
          
        </Layout>
    );
}

export default UserProfileScreen;
