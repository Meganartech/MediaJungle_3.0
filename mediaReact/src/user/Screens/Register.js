// import React, { useState, useEffect } from 'react';
// import Layout from '../Layout/Layout';
// import { Input } from '../Components/UsedInputs';
// import { Link } from 'react-router-dom';
// import { FiLogIn } from 'react-icons/fi';
// import axios from 'axios';
// import API_URL from '../../Config';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//     const [data, setData] = useState({
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         mobnum: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [getall, setGetAll] = useState('');
//     const navigate = useNavigate();
//     const userId = Number(sessionStorage.getItem('userId')); // Get userId from session storage

//     // Fetch existing user data to prefill the form fields
//     useEffect(() => {
//         if (userId) { // If userId exists, fetch the user data
//             axios.get(`${API_URL}/api/v2/GetUserById/${userId}`)
//                 .then(response => {
//                     const userData = response.data;
//                     setData({
//                         username: userData.username || '',
//                         email: userData.email || '',
//                         mobnum: userData.mobnum || '',
//                         password: '', // Leave password empty for security reasons
//                         confirmPassword: ''
//                     });
//                 })
//                 .catch(error => {
//                     console.error('Error fetching user data:', error);
//                 });
//         }
//     }, [userId]);

//     const handleChange = (e) => {
//         setData({ ...data, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: undefined });
//     };

//     const validateForm = () => {
//         let isValid = true;
//         const newErrors = {};

//         if (!data.username.trim()) {
//             newErrors.username = 'Username is required';
//             isValid = false;
//         }

//         if (!data.email.trim()) {
//             newErrors.email = 'Email is required';
//             isValid = false;
//         } else if (!/\S+@\S+\.\S+/.test(data.email)) {
//             newErrors.email = 'Invalid email address';
//             isValid = false;
//         }

//         if (!data.password.trim()) {
//             newErrors.password = 'Password is required';
//             isValid = false;
//         }

//         if (!data.confirmPassword.trim()) {
//             newErrors.confirmPassword = 'Confirm Password is required';
//             isValid = false;
//         } else if (data.password !== data.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//             isValid = false;
//         }

//         if (!data.mobnum.trim()) {
//             newErrors.mobnum = 'Mobile number is required';
//             isValid = false;
//         } else if (!/^\d{10}$/.test(data.mobnum)) {
//             newErrors.mobnum = 'Invalid mobile number';
//             isValid = false;
//         }

//         setErrors(newErrors);
//         return isValid;
//     };

//     const submitForm = async (e) => {
//         e.preventDefault();

//         if (validateForm()) {
//             try {
//                 const formData = new FormData();
//                 for (const key in data) {
//                     if (data.hasOwnProperty(key)) {
//                         formData.append(key, data[key]);
//                     }
//                 }

//                 const url = userId ? `${API_URL}/api/v2/updateUser/${userId}` : `${API_URL}/api/v2/userregister`;
//                 const response = await axios.post(url, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 });

//                 if (response.status === 200) {
//                     Swal.fire({
//                         icon: 'success',
//                         title: userId ? 'Profile updated successfully' : 'Registered successfully',
//                         confirmButtonColor: '#FFC107'
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             navigate('/UserLogin');
//                         }
//                     });
//                 } else {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Operation Failed',
//                         text: 'Please try again.'
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Operation Failed',
//                     text: 'An error occurred. Please try again.'
//                 });
//             }
//         }
//     };

//     return (
//         <form onSubmit={submitForm}>
//             <Layout className='container mx-auto overflow-y-auto'>
//                 <div className='px-2 my-24 flex-colo '>
//                     <div className='w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-3/5 bg-dry rounded-lg border border-border'>
//                         {getall.length > 0 && getall[0].logo ? (
//                             <img
//                                 src={`data:image/png;base64,${getall[0].logo}`}
//                                 alt='logo'
//                                 className='w-full h-12 object-contain'
//                             />
//                         ) : (
//                             <div></div>
//                         )}
//                         <Input
//                             label="User Name"
//                             placeholder="New10Media Website"
//                             type="text"
//                             bg={true}
//                             name='username'
//                             value={data.username}
//                             onChange={handleChange}
//                             required
//                         />
//                         {errors.username && (
//                             <p className="text-yellow-600">{errors.username}</p>
//                         )}
//                         <Input
//                             label="Email"
//                             placeholder="newtonmedia@gmail.com"
//                             type='email'
//                             bg={true}
//                             name="email"
//                             value={data.email}
//                             onChange={handleChange}
//                             required
//                         />
//                         {errors.email && (
//                             <p className="text-yellow-600">{errors.email}</p>
//                         )}
//                         <Input
//                             label="Password"
//                             placeholder="************"
//                             type="password"
//                             bg={true}
//                             name='password'
//                             value={data.password}
//                             onChange={handleChange}
//                             required
//                         />
//                         {errors.password && (
//                             <p className="text-yellow-600">{errors.password}</p>
//                         )}
//                         <Input
//                             label="Confirm Password"
//                             placeholder="************"
//                             type="password"
//                             bg={true}
//                             name='confirmPassword'
//                             value={data.confirmPassword}
//                             onChange={handleChange}
//                             required
//                         />
//                         {errors.confirmPassword && (
//                             <p className="text-yellow-600">{errors.confirmPassword}</p>
//                         )}
//                         <Input
//                             label="Phone Number"
//                             placeholder="9876543210"
//                             type="tel"
//                             bg={true}
//                             name='mobnum'
//                             value={data.mobnum}
//                             onChange={handleChange}
//                             required
//                         />
//                         {errors.mobnum && (
//                             <p className="text-yellow-600">{errors.mobnum}</p>
//                         )}

//                         <button type="submit" className='bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full'>
//                             <FiLogIn />{userId ? 'Update Profile' : 'Sign Up'}
//                         </button>

//                         <p className='text-center text-border'>
//                             Already have an account?{" "}
//                             <Link to='/UserLogin' className='text-dryGray font-semibold ml-2'>
//                                 SignIn
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </Layout>
//         </form>
//     );
// }

// export default Register;











import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import axios from 'axios';
import API_URL from '../../Config';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Register = () => {
    const [username,setusername] = useState('');
    const [email,setemail] = useState('');
    const [password,setpassword] = useState('');
    const [confirmpassword,setconfirmpassword] = useState('');
    const [mobilenumber,setmobilenumber] = useState('');
    const [code,setcode] = useState('');
    const [errors, setErrors] = useState({});
    const [getall, setGetAll] = useState('');
    const [verifyresponse,setverifyresponse] = useState('false');
    const navigate = useNavigate();
    const userId = Number(sessionStorage.getItem('userId')); // Get userId from session storage

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


    const validatecode = () => {
        let isValid = true;
        const newErrors = {};

        if(code.trim()) {
            newErrors.code = '';
            isValid = false;
        }
        setErrors(newErrors); // Update the state with new errors
        return isValid;
    };
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
    
        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }
    
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }
    
        if (!password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6 || password.length > 15) {
            newErrors.password = 'Password must be between 6 and 15 characters';
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            newErrors.password = 'Password must contain at least one special character';
            isValid = false;
        }
        
        if (!confirmpassword.trim()) {
            newErrors.confirmpassword = 'Confirm Password is required';
            isValid = false;
        } else if (password !== confirmpassword) {
            newErrors.confirmpassword = 'Passwords do not match';
            isValid = false;
        }
    
        if (!mobilenumber.trim()) {
            newErrors.mobilenumber = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(mobilenumber)) {
            newErrors.mobilenumber = 'Invalid mobile number';
            isValid = false;
        }
    
        setErrors(newErrors); // Update the state with new errors
        return isValid;
    };



    const SendCode = async (e) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = {};
    
        // Step 1: Validate Email
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }
        setErrors(newErrors);
    
        if (!isValid) {
            return;
        }
    
        // Step 2: Prepare FormData
        const data = new FormData();
        data.append('email', email);
    
        try {
            // Show loading Swal
            Swal.fire({
                title: 'Sending...',
                text: 'Please wait while we send the verification code.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
    
            // Step 3: Send Verification Code
            const sendCodeResponse = await axios.post(
                `${API_URL}/api/v2/send-code`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            // Close the loading Swal
            Swal.close();
    
            // Step 4: Handle Successful Response
            Swal.fire({
                icon: 'success',
                title: 'Verification code sent!',
                text: sendCodeResponse.data, // Display backend message
            });
        } catch (sendError) {
            // Close the loading Swal
            Swal.close();
    
            // Step 5: Handle Errors
            if (sendError.response) {
                const status = sendError.response.status;
                const backendMessage = sendError.response.data;
    
                if (status === 409) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Conflict',
                        text: backendMessage || 'The email is already registered.',
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/UserLogin'); // Navigate to login
                        }
                    })
                } else if (status === 400) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Bad Request',
                        text: backendMessage || 'Failed to send verification code.',
                    });
                } else if (status === 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: backendMessage || 'An internal server error occurred.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unexpected Error',
                        text: backendMessage || 'An unexpected error occurred. Please try again.',
                    });
                }
            } else {
                // If no response from the server
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Failed to connect to the server. Please check your connection.',
                });
            }
        }
    };
    
    
    const verifyCode = async (e) => {
        e.preventDefault();
        // if (!validatecode()) return; // Ensure form validation before proceeding
        const verifyData = new FormData();
        verifyData.append('email', email);
        verifyData.append('code', code);
    
        try {
            const verifyResponse = await axios.post(`${API_URL}/api/v2/verify-code`, verifyData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Success response (HTTP 200)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: verifyResponse.data.message || 'Verification successful!', // Display success message
            });
    
            // Update verification status
            setverifyresponse('yes');
            return true; // Indicate verification success
        } catch (error) {
            // Extract status and message from the error response
            const status = error.response?.status;
            const message = error.response?.data?.message || 'An unexpected error occurred.';
    
            // Handle specific statuses
            if (status === 400) {
                // Warning for invalid input
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: message, // Show backend message
                });
                setErrors({ code: message });
            } else if (status === 500) {
                // Error for server-side issues
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: message, // Show backend message
                });
                setErrors({ code: message });
            } else {
                // Default fallback for other errors
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: message, // Fallback message
                });
                setErrors({ code: message });
            }
            return false; // Indicate verification failure
        }
    };
    
    
    
    
    const submitForm = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return; // Ensure form validation before proceeding
        
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("confirmPassword", confirmpassword);
            formData.append("mobnum", mobilenumber);
            const registrationResponse = await axios.post(`${API_URL}/api/v2/userregister`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (registrationResponse.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registered successfully',
                    text: 'You are now registered. Redirecting to login...',
                    confirmButtonColor: '#FFC107',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/UserLogin'); // Navigate to login
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration failed',
                    text: 'Please try again.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: error.response.data ||'An error occurred. Please try again.',
            });
        }
    };

    console.log(verifyresponse);

    return (
        <Layout>
            <div className='forgot-password-container'>
                <div className="register-box">
                {getall.length > 0 && getall[0].logo ? (
                        <img
                            src={`data:image/png;base64,${getall[0].logo}`}
                            alt="logo"
                            className="logoimage"
                        />
                    ) : (
                        <div></div>
                    )}
                    <span>Sign Up</span>
                    <form className="registerfield" onSubmit={submitForm}>
                        <label>User Name</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            placeholder="User Name"
                            className="register-field"
                            onChange={(e) => setusername(e.target.value)} // Corrected here
                        />
                        {errors.username && (
                            <p style={{color:'red'}}>{errors.username}</p>
                        )}
                        <label>Email</label>
<div className="otp-container">
    <input
        type="email"
        name="email"
        value={email}
        placeholder="Enter your email"
        className="register-field"
        disabled={verifyresponse === 'yes'}
        onChange={(e) => setemail(e.target.value)} // Use camelCase for consistency
    />
    <button
        className="get-otp-button"
        disabled={!email || verifyresponse === 'yes'} // Enable only if email is filled and not already verified
        onClick={SendCode} // Consistent naming convention
    >
        Get OTP
    </button>
</div>
{errors.email && (
    <p style={{ color: 'red' }}>{errors.email}</p>
)}
<div className="verify-container">
    <input
        type="text"
        name="code"
        value={code}
        placeholder="Enter OTP code"
        className="register-field"
        disabled={verifyresponse === 'yes'}
        onChange={(e) => setcode(e.target.value)} // Use camelCase for setter functions
    />
    {errors.code && (<p style={{ color: 'red' }}>{errors.code}</p>)}
    {verifyresponse === 'yes'? (
    <span
        className="get-tick-button"
        // style={{ color: 'green', marginBottom: '5px' }}
    >
        &#10004; {/* Unicode for green tick */}
    </span>
) : (
    <button
        className="get-verify-button"
        disabled={!code || verifyresponse === 'yes'} // Enable only if code is filled and not already verified
        onClick={verifyCode} // Consistent naming
    >
        Verify
    </button>
)}

</div>
                        
                        
                       <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Password"
                            className="register-field"
                            onChange={(e) => setpassword(e.target.value)} // Corrected here
                        />
                        {errors.password && (
                            <p style={{color:'red'}}>{errors.password}</p>
                        )}
                       <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmpassword"
                            value={confirmpassword}
                            placeholder="Confirm Password"
                            className="register-field"
                            onChange={(e) => setconfirmpassword(e.target.value)} // Corrected here
                        />
                        {errors.confirmpassword && (
                            <p style={{color:'red'}}>{errors.confirmpassword}</p>
                        )}
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="mobilenumber"
                            value={mobilenumber}
                            placeholder="Phone Number"
                            className="register-field"
                            onChange={(e) => setmobilenumber(e.target.value)} // Corrected here
                        />
                        {errors.mobilenumber && (
                            <p style={{color:'red'}}>{errors.mobilenumber}</p>
                        )}
                        <button
        type="submit"
        className={`submit-registerbutton ${verifyresponse === 'false' ? 'disabled-button' : ''}`}
        disabled={verifyresponse === 'false'} // Disable the button when `verifyresponse` is false
    >
        Sign Up
    </button>
                        <span>Already have an account? <Link to="/Userlogin"><span style={{textDecoration:'underline'}}> Signin</span></Link></span>
                    </form>
                </div>

            </div>
        </Layout>
    );
}

export default Register;

