import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation
import Layout from './Layout/Layout';
import { FiLogIn } from 'react-icons/fi';
import { FaBell, FaPen } from 'react-icons/fa'; // Import the pen icon for editing
import API_URL from '../Config';

const UserProfileScreen = () => {
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
            <div className='px-10 my-24 flex flex-col items-center'>
                {/* Separate div for User Profile Picture */}
                <div className="flex justify-center mb-6 relative">
                    {user && user.profilePicture ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden flex justify-center items-center border-4 border-yellow-600">
                            <img
                                src={user.profilePicture} // Profile image URL
                                alt="User Profile"
                                className="w-full h-full object-cover" // Ensure image fills the circle
                            />
                        </div>
                    ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex justify-center items-center text-gray-500">
                            No Image
                        </div>
                    )}
                    {/* Pen icon for editing */}
                    {user && user.profilePicture && (
                        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-white p-2 rounded-full shadow-lg cursor-pointer">
                            <FaPen className="text-yellow-600" />
                        </div>
                    )}
                </div>

                {/* Separate div for User Information */}
                <div>
                    {jwtToken && user ? (
                        <>
                            <div className="mb-6">
                                <label className="block text-yellow-600 text-lg font-medium mb-2">
                                    <FaBell />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className="text-lg font-medium text-gray-500">{user.username}</span>
                                </label>
                            </div>
                            <div className="mb-6">
                                <label className="block text-yellow-600 text-lg font-medium mb-2">
                                    Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className="text-lg font-medium text-gray-500">{user.email}</span>
                                </label>
                            </div>
                            <div className="mb-6">
                                <label className="block text-yellow-600 text-lg font-medium mb-2">
                                    Plan:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className="text-lg font-medium text-gray-500">
                                        {user.paymentId ? `${user.paymentId.subscriptionTitle} (Active until ${user.paymentId.expiryDate})` : "Free"}
                                    </span>
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
    );
}

export default UserProfileScreen;
