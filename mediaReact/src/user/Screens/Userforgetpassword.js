import React, { useState,useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Input } from '../Components/UsedInputs';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import API_URL from '../../Config';
import { useNavigate } from 'react-router-dom';

const Userforgetpassword = () => {
    const [getall,setGetAll] = useState('');
    const [user, setUser] = useState({ email: '', password: '',confirmPassword:'' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
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

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const sendData = {
                email: user.email,
                password: user.password,
                confirmPassword:user.confirmPassword,
            };
    
            const response = await fetch(`${API_URL}/api/v2/forgetPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sendData),
            });
    
            if (response.ok) {
                navigate('/UserLogin');
                
            } else {
                // Handle errors here
                const errorData = await response.json();
                setErrorMessage(errorData.message);
            }
        } catch (error) {
            // Handle exceptions here
            console.error("An error occurred", error);
        }
    };
   
  return (
    <form onSubmit={handleSubmit}>
  <Layout>
    <div className='container mx-auto px-2 my-24 flex-colo'>
      <div className='w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-3/5 bg-dry rounded-lg border border-border'>
        {getall.length > 0 && getall[0].logo ? (
          <img
            src={`data:image/png;base64,${getall[0].logo}`}
            alt='logo'
            className='mx-auto h-16 object-contain mb-6'
          />
        ) : (
          <div></div>
        )}
        <Input
          label="Email"
          placeholder="newtonmedia@gmail.com"
          type='email'
          bg={true}
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          placeholder="************"
          type='password'
          bg={true}
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirm Password"
          placeholder="************"
          type='password'
          bg={true}
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleChange}
          required
        />
         <button
          type='submit'
          className='bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full mt-4'
        >
          <FiLogIn /> Reset Password
        </button>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </div>
    </div>
  </Layout>
  </form>
 
  )
}

export default Userforgetpassword