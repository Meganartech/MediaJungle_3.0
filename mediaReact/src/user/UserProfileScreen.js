import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Layout from './Layout/Layout';
import { FiLogIn } from 'react-icons/fi';
import { FaBell, FaKey, FaPen, FaUserEdit } from 'react-icons/fa';
import API_URL from '../Config';
import Swal from 'sweetalert2';

const UserProfileScreen = () => {
    const name = sessionStorage.getItem("name");
    const jwtToken = sessionStorage.getItem("token");
    const userId = Number(sessionStorage.getItem("userId")); // Convert to number

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [getall, setGetAll] = useState('');
    const [imageSrc, setImageSrc] = useState(null);

    // Load profile image function
    const loadProfileImage = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v2/GetProfileImage/${userId}?t=${new Date().getTime()}`);
            if (!response.ok) {
                setImageSrc(null); // Set imageSrc to null if image is not found
                return;
            }

            const imageBlob = await response.blob(); // Convert response to Blob
            const imageObjectURL = URL.createObjectURL(imageBlob); // Create URL for the Blob
            setImageSrc(imageObjectURL); // Set the image source

            // Clean up previous object URL
            return () => URL.revokeObjectURL(imageObjectURL);
        } catch (err) {
            console.error('Error fetching image:', err);
            setImageSrc(null); // Set imageSrc to null to display "No Image" placeholder
        }
    };

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem("token"); // Retrieve token from session storage
            if (!token) {
                console.error("Token not found");
                return;
            }

            const confirmLogout = await Swal.fire({
                title: "Are you sure?",
                text: "You are about to logout.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#FBC740",
                cancelButtonColor: "#FBC740",
                confirmButtonText: "Yes, logout",
                cancelButtonText: "Cancel",
            });

            if (confirmLogout.isConfirmed) {
                const response = await fetch(`${API_URL}/api/v2/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = "/UserLogin";
                    localStorage.setItem('login', false);
                    console.log("Logged out successfully");
                    return;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Logout failed',
                        text: 'Please try again later.',
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while logging out. Please try again later.',
            });
        }
    };

    useEffect(() => {
        loadProfileImage();
    }, [userId]); 

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${API_URL}/api/v2/UploadProfileImage/${userId}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Image upload failed');
                }

                loadProfileImage();
            } catch (err) {
                console.error('Error uploading image:', err);
                setError(err.message);
            }
        }
    };

    useEffect(() => {
        if (!jwtToken) {
            setLoading(false); 
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
                <div className="relative mb-6 flex justify-center">
                    {imageSrc ? (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-600">
                            <img
                                src={imageSrc}
                                alt="User Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex justify-center items-center text-gray-500">
                            No Image
                        </div>
                    )}
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <div>
                    {jwtToken && user ? (
                        <>
                            <div className="mb-6">
                                <label className="flex text-yellow-600 text-lg font-medium">
                                    <FaBell />
                                    <span className="ml-4 text-lg font-medium text-gray-500">
                                        <Link to="/Subscriptiondetails">Subscription Plan</Link>
                                    </span>
                                </label>
                            </div>
                            <div className="mb-6">
                                <label className="flex text-yellow-600 text-lg font-medium mb-2">
                                    <FaKey />
                                    <span className="ml-4 text-lg font-medium text-gray-500"><Link to="/Userforgetpassword">Change Password</Link></span>
                                </label>
                            </div>
                            <div className="mb-6">
                                <label className="flex text-yellow-600 text-lg font-medium mb-2">
                                    <FaUserEdit />
                                    <span className="ml-4 text-lg font-medium text-gray-500">
                                        <Link to="/viewProfile">Profile</Link>
                                    </span>
                                </label>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleLogout}
                                    className='bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-800 justify-center'
                                >
                                    Logout
                                </button>
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
