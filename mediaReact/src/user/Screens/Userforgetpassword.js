// import React, { useState, useEffect } from 'react';
// import Layout from '../Layout/Layout';
// import { Input } from '../Components/UsedInputs';
// import { FiLogIn, FiUpload } from 'react-icons/fi';
// import API_URL from '../../Config';
// import { useNavigate } from 'react-router-dom';


// const Userforgetpassword = () => {
//     const [getall, setGetAll] = useState('');
//     const [user, setUser] = useState({ email: '', password: '', confirmPassword: '' });
//     const [errorMessage, setErrorMessage] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setUser({ ...user, [e.target.name]: e.target.value });
//     };

//     useEffect(() => {
//         fetch(`${API_URL}/api/v2/GetsiteSettings`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 setGetAll(data);
//                 console.log(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const sendData = {
//                 email: user.email,
//                 password: user.password,
//                 confirmPassword: user.confirmPassword,
//             };

//             const response = await fetch(`${API_URL}/api/v2/forgetPassword`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(sendData),
//             });

//             if (response.ok) {
//                 // Clear user data from session storage
//                 sessionStorage.removeItem('token');
//                 sessionStorage.removeItem('userId');
//                 sessionStorage.removeItem('name');
                
//                 // Show alert message
//                 alert("Password changed successfully! Redirecting to login page...");

//                 // Redirect after showing the alert
//                 setTimeout(() => {
//                     navigate('/UserLogin');
//                 }, 2000); // Redirect after 2 seconds
//             } else {
//                 // Handle errors here
//                 const errorData = await response.json();
//                 setErrorMessage(errorData.message);
//             }
//         } catch (error) {
//             // Handle exceptions here
//             console.error("An error occurred", error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <Layout>
//                 <div className='container mx-auto flex-colo'>
//                     <div className='w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-2/5 rounded-lg border border-border' style={{
//                         background: 'linear-gradient(to top, #141335, #0c0d1a)', // Gradient background applied here
//                     }}>
//                         {getall.length > 0 && getall[0].logo ? (
//                             <img
//                                 src={`data:image/png;base64,${getall[0].logo}`}
//                                 alt='logo'
//                                 className='mx-auto h-16 object-contain mb-6'
//                             />
//                         ) : (
//                             <div></div>
//                         )}
//                         <Input
//                             label="Email"
//                             placeholder="newtonmedia@gmail.com"
//                             type='email'
//                             bg={true}
//                             name="email"
//                             value={user.email}
//                             onChange={handleChange}
//                             required
//                         />
//                         <Input
//                             label="New Password"
//                             placeholder="************"
//                             type='password'
//                             bg={true}
//                             name="password"
//                             value={user.password}
//                             onChange={handleChange}
//                             required
//                         />
//                         <Input
//                             label="Confirm Password"
//                             placeholder="************"
//                             type='password'
//                             bg={true}
//                             name="confirmPassword"
//                             value={user.confirmPassword}
//                             onChange={handleChange}
//                             required
//                         />
//                         <button
//                             type='submit'
//                             className='bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full mt-4'
//                         >
//                           <FiUpload />Update Password
//                         </button>
//                         {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
//                     </div>
//                 </div>
//             </Layout>
//         </form>
//     );
// }

// export default Userforgetpassword;


import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Input } from '../Components/UsedInputs';
import { FiLogIn, FiUpload } from 'react-icons/fi';
import API_URL from '../../Config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';


const Userforgetpassword = () => {
    const [getall, setGetAll] = useState('');
    const [email, setEmail] = useState('');
    const [code,setcode] = useState('');
    const [password,setPassword] = useState('');
    const [conformPassword,setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showCode,setShowCode] = useState(true); // State for toggling password visibility
    const [showwPassword,setShowPassword] =useState(true);
    const [showConfirmPassword,setShowConformPassword] = useState(true);

    const toggleCodeVisibility = () => {
        setShowCode((prevShowcode) => !prevShowcode);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);  
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConformPassword((prevShowConfirmPassword)=>!prevShowConfirmPassword);
    };

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


    const nextStep = () => {
        setCurrentStep(currentStep + 1);
      };


    const SendEmail = async (e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
    
        const data = new FormData();
        data.append('email', email);
    
        try {
            const senddata = await axios.post(`${API_URL}/api/v2/send-code`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (senddata.status === 200) {
                // Set a timer to show the toast message after a short delay
                console.log(senddata);
                toast.success(senddata.data);
                // Only increase the step if the current step is 1
            if (currentStep === 1) {
                nextStep();
            }
            }
        }
        catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while sending the verification code.');
        }
    };

    const SendVerifyCode  = async (e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
    
        const data = new FormData();
        data.append('email', email);
        data.append('code',code);
    
        try {
            const senddata = await axios.post(`${API_URL}/api/v2/verify-code`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (senddata.status === 200) {
                // Set a timer to show the toast message after a short delay
                console.log(senddata);
                setTimeout(() => {
                    toast.success(senddata.data);
                }, 1000); // Adjust time (1000ms = 1 second)
                
                // Move to the next step
                nextStep();
            }
        }
        catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while sending the verification code.');
        }
    };



    const handleSubmit = async (e) => {
                e.preventDefault();
        
                try {
                    const sendData = {
                        email: email,
                        password: password,
                        confirmPassword: conformPassword,
                    };
        
                    const response = await fetch(`${API_URL}/api/v2/forgetPassword`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(sendData),
                    });
        
                    if (response.ok) {
                        // Show alert message
                        toast.success("Password changed successfully! Redirecting to login page...");
        
                        // Redirect after showing the alert
                        setTimeout(() => {
                            navigate('/UserLogin');
                        }, 2000); // Redirect after 2 seconds
                    } else {
                        // Handle errors here
                        const errorData = await response.json();
                        toast.error(errorData.message);
                    }
                } catch (error) {
                    // Handle exceptions here
                    console.error("An error occurred", error);
                }
            };
            

    return (
        <Layout>
            <div className="forgot-password-container">
            {currentStep === 1 && (
            <>
                <div className="form-box">
                    <a href="/Userlogin" className="back-to-login">
                        &lt; Back to login
                    </a>
                    {getall.length > 0 && getall[0].logo ? (
                        <img
                            src={`data:image/png;base64,${getall[0].logo}`}
                            alt="logo"
                            className="logoimage"
                        />
                    ) : (
                        <div></div>
                    )}
                    <span>Sign In</span>
                    <span className="forgot">Forgot your password?</span>
                    <form className="formfield" onSubmit={SendEmail}>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Email or mobile number"
                            className="input-field"
                            onChange={(e) => setEmail(e.target.value)} // Corrected here
                        />
                        <button type="submit" className="submit-verifybutton">
                            Submit
                        </button>
                    </form>
                </div>
                </>

            )}

            {currentStep == 2 &&(
                <>
                <div className="form-box">
                    <a href="/Userlogin" className="back-to-login">
                        &lt; Back to login
                    </a>
                    {getall.length > 0 && getall[0].logo ? (
                        <img
                            src={`data:image/png;base64,${getall[0].logo}`}
                            alt="logo"
                            className="logoimage"
                        />
                    ) : (
                        <div></div>
                    )}
                    <span>Sign In</span>
                    <span className="forgot">Verify code</span>
                    <span className="forgot1">An authendication code has been sent to your email</span>
                    <form className="formfield" onSubmit={SendVerifyCode}>
                    <div className="input-container">
                <input
                    type={showCode ? "password" : "text"} // Toggle between text and password
                    name="code"
                    value={code}
                    placeholder="Enter the OTP"
                    className="input-field"
                    onChange={(e) => setcode(e.target.value)}
                />
                <i
                    className={`bi ${showCode ? 'bi-eye-slash' : 'bi-eye'} eye-icon`} // Bootstrap icons
                    onClick={toggleCodeVisibility}
                ></i>
            </div>
                        <span className='resend'>Don't Receive a code?<span className='resend1' onClick={SendEmail}> Resend</span></span>
                        <button type="submit" className="submit-verifybutton">
                            Submit
                        </button>
                    </form>
                </div>
                </>
            )}

{currentStep === 3 && (
            <>
            <div className="form-box">
                    <a href="/Userlogin" className="back-to-login">
                        &lt; Back to login
                    </a>
                    {getall.length > 0 && getall[0].logo ? (
                        <img
                            src={`data:image/png;base64,${getall[0].logo}`}
                            // src={`${API_URL}/api/v2/logo/1`}
                            alt="logo"
                            className="logoimage"
                        />
                    ) : (
                        <div></div>
                    )}
                    <span>Sign In</span>
                    <span className="forgot">Set a Password</span>
                    <span className="forgot1">Your previous password has been reseted. Please set a new password for your account</span>
                    <form className="formfield" onSubmit={handleSubmit}>
                    <div className="input-container">
                <input
                    type={showwPassword? "password" : "text"} // Toggle between text and password
                    name="code"
                    value={password}
                    placeholder="Enter the New Password"
                    className="input-field"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <i
                    className={`bi ${showwPassword ? 'bi-eye-slash' : 'bi-eye'} password-eye-icon`} // Bootstrap icons
                    onClick={togglePasswordVisibility}
                ></i>
                <input
                    type={showConfirmPassword ? "password" : "text"} // Toggle between text and password
                    name="code"
                    value={conformPassword}
                    placeholder="Confirm Password"
                    className="input-field"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i
                    className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} confirm-eye-icon`} // Bootstrap icons
                    onClick={toggleConfirmPasswordVisibility}
                ></i>
            </div>
                        <button type="submit" className="submit-verifybutton">
                            Submit
                        </button>
                    </form>
                </div>
            
            </>
)}
            </div>
            
        </Layout>
    );
};
export default Userforgetpassword;

