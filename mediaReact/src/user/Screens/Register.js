import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Input } from '../Components/UsedInputs';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import axios from 'axios';
import API_URL from '../../Config';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobnum: ''
    });
    const [errors, setErrors] = useState({});
    const [getall, setGetAll] = useState('');
    const navigate = useNavigate();
    const userId = Number(sessionStorage.getItem('userId')); // Get userId from session storage

    // Fetch existing user data to prefill the form fields
    useEffect(() => {
        if (userId) { // If userId exists, fetch the user data
            axios.get(`${API_URL}/api/v2/GetUserById/${userId}`)
                .then(response => {
                    const userData = response.data;
                    setData({
                        username: userData.username || '',
                        email: userData.email || '',
                        mobnum: userData.mobnum || '',
                        password: '', // Leave password empty for security reasons
                        confirmPassword: ''
                    });
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userId]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!data.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (!data.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (!data.password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        if (!data.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm Password is required';
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!data.mobnum.trim()) {
            newErrors.mobnum = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(data.mobnum)) {
            newErrors.mobnum = 'Invalid mobile number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const formData = new FormData();
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        formData.append(key, data[key]);
                    }
                }

                const url = userId ? `${API_URL}/api/v2/updateUser/${userId}` : `${API_URL}/api/v2/userregister`;
                const response = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: userId ? 'Profile updated successfully' : 'Registered successfully',
                        confirmButtonColor: '#FFC107'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/UserLogin');
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: 'Please try again.'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Operation Failed',
                    text: 'An error occurred. Please try again.'
                });
            }
        }
    };

    return (
        <form onSubmit={submitForm}>
            <Layout className='container mx-auto overflow-y-auto'>
                <div className='px-2 my-24 flex-colo '>
                    <div className='w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-3/5 bg-dry rounded-lg border border-border'>
                        {getall.length > 0 && getall[0].logo ? (
                            <img
                                src={`data:image/png;base64,${getall[0].logo}`}
                                alt='logo'
                                className='w-full h-12 object-contain'
                            />
                        ) : (
                            <div></div>
                        )}
                        <Input
                            label="User Name"
                            placeholder="New10Media Website"
                            type="text"
                            bg={true}
                            name='username'
                            value={data.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && (
                            <p className="text-yellow-600">{errors.username}</p>
                        )}
                        <Input
                            label="Email"
                            placeholder="newtonmedia@gmail.com"
                            type='email'
                            bg={true}
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && (
                            <p className="text-yellow-600">{errors.email}</p>
                        )}
                        <Input
                            label="Password"
                            placeholder="************"
                            type="password"
                            bg={true}
                            name='password'
                            value={data.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && (
                            <p className="text-yellow-600">{errors.password}</p>
                        )}
                        <Input
                            label="Confirm Password"
                            placeholder="************"
                            type="password"
                            bg={true}
                            name='confirmPassword'
                            value={data.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-yellow-600">{errors.confirmPassword}</p>
                        )}
                        <Input
                            label="Phone Number"
                            placeholder="9876543210"
                            type="tel"
                            bg={true}
                            name='mobnum'
                            value={data.mobnum}
                            onChange={handleChange}
                            required
                        />
                        {errors.mobnum && (
                            <p className="text-yellow-600">{errors.mobnum}</p>
                        )}

                        <button type="submit" className='bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full'>
                            <FiLogIn />{userId ? 'Update Profile' : 'Sign Up'}
                        </button>

                        <p className='text-center text-border'>
                            Already have an account?{" "}
                            <Link to='/UserLogin' className='text-dryGray font-semibold ml-2'>
                                SignIn
                            </Link>
                        </p>
                    </div>
                </div>
            </Layout>
        </form>
    );
}

export default Register;
