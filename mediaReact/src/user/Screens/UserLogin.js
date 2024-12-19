import React, { useState,useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Input } from '../Components/UsedInputs';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import API_URL from '../../Config';
import axios from 'axios';

const UserLogin = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [getall,setGetAll] = useState('');
  const [mailConfig, setMailConfig] = useState(null);


  // Function to fetch mail configuration
  const fetchMailConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/getmailconfig`);
      if (response.status === 200) {
        setMailConfig(response.data); // Store the configuration data in state
      } else {
        console.error('Failed to fetch mail configuration.');
      }
    } catch (err) {
      console.error('Error fetching mail configuration:', err);
    }
  };


  // Fetch the configuration on component mount
  useEffect(() => {
    fetchMailConfig();
  }, []);

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

    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          const sendData = {
              email: user.email,
              password: user.password
          };
  
          const response = await fetch(`${API_URL}/api/v2/login`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(sendData),
          });
  
          if (response.ok) {
              // Await the JSON response
              const data = await response.json(); // Retrieve JSON data
              const jwtToken = data.token;
              const name = data.name;
              const userId=data.userId;
              // Store token in session storage
              sessionStorage.setItem("name", name);
              sessionStorage.setItem('token', jwtToken);
              sessionStorage.setItem('userId',userId);
              localStorage.setItem('login', true);
              
              
              window.location.href = "/";
              
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
  <Layout >
    <div className='container mx-auto flex-colo' >
      <div className='w-full 2xl:w-2/5 gap-8 flex-colo p-8 sm:p-14 md:w-2/5 rounded-lg border border-border'   style={{
          background: 'linear-gradient(to top, #141335, #0c0d1a)', // Gradient background applied here
        }}>
        {getall.length > 0 && getall[0].logo ? (
          <img
            src={`data:image/png;base64,${getall[0].logo}`}
            alt='logo'
            className='mx-auto h-20 object-contain'
          />
        ) : (
          <div></div>
        )}
        <Input
          
          placeholder="Enter Email"
          type='email'
          bg={true}
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <Input
          placeholder="Enter Password"
          type='password'
          bg={true}
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />
        {mailConfig ? (
  <p className="w-full flex flex-end justify-between" style={{ marginTop: '-18px' }}>
    <Link to="/forgetPassword" className="text-dryGray font-semibold">
      Forget Password?
    </Link>
  </p>
) : null}

        <button
          type='submit'
          className='bg-dry transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg'
          style={{height:'20px'}}
        >
          <FiLogIn /> Log In
        </button>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        <p className='text-border'>
         New to Media Jungle?{" "}
          <Link to='/Register' className='text-dryGray font-semibold ml-2 underline'>
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  </Layout>
</form>
  );
}

export default UserLogin;


// import React, { useState,useEffect } from 'react';
// import Layout from '../Layout/Layout';
// import API_URL from '../../Config';
// import axios from 'axios';

// const UserLogin = () => {
//   const [user, setUser] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [getall,setGetAll] = useState('');
//   const [mailConfig, setMailConfig] = useState(null);


//   // Function to fetch mail configuration
//   const fetchMailConfig = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v2/getmailconfig`);
//       if (response.status === 200) {
//         setMailConfig(response.data); // Store the configuration data in state
//       } else {
//         console.error('Failed to fetch mail configuration.');
//       }
//     } catch (err) {
//       console.error('Error fetching mail configuration:', err);
//     }
//   };


//   // Fetch the configuration on component mount
//   useEffect(() => {
//     fetchMailConfig();
//   }, []);

//   useEffect(() => {
//     fetch(`${API_URL}/api/v2/GetsiteSettings`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setGetAll(data);
//         console.log(data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//     const handleChange = (e) => {
//       setUser({ ...user, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//       e.preventDefault();
  
//       try {
//           const sendData = {
//               email: user.email,
//               password: user.password
//           };
  
//           const response = await fetch(`${API_URL}/api/v2/login`, {
//               method: "POST",
//               headers: {
//                   "Content-Type": "application/json",
//               },
//               body: JSON.stringify(sendData),
//           });
  
//           if (response.ok) {
//               // Await the JSON response
//               const data = await response.json(); // Retrieve JSON data
//               const jwtToken = data.token;
//               const name = data.name;
//               const userId=data.userId;
//               // Store token in session storage
//               sessionStorage.setItem("name", name);
//               sessionStorage.setItem('token', jwtToken);
//               sessionStorage.setItem('userId',userId);
//               localStorage.setItem('login', true);
              
              
//               window.location.href = "/";
              
//           } else {
//               // Handle errors here
//               const errorData = await response.json();
//               setErrorMessage(errorData.message);
//           }
//       } catch (error) {
//           // Handle exceptions here
//           console.error("An error occurred", error);
//       }
//   };
//   return (
//     <Layout>
//       <div className='forgot-password-container'>
//       <div className="register-box">
//       {getall.length > 0 && getall[0].logo ? (
//                         <img
//                             src={`data:image/png;base64,${getall[0].logo}`}
//                             alt="logo"
//                             className="logoimage"
//                         />
//                     ) : (
//                         <div></div>
//                     )}
//                     <span>Sign In</span>
//                     <form className="registerfield">
//                         <input
//                             type="text"
//                             // name="username"
//                             // value={username}
//                             placeholder="Email"
//                             className="register-field"
//                             style={{marginTop:'20px'}}
//                             // onChange={(e) => setusername(e.target.value)} // Corrected here
//                         />
//                         <input
//                             type="text"
//                             // name="email"
//                             // value={email}
//                             placeholder="Password"
//                             className="register-field"
//                             style={{marginTop:'25px'}}
//                             // onChange={(e) => setemail(e.target.value)} // Corrected here
//                         />
//                        <span>Forget Password</span>
//                        <button type="submit" className="submit-registerbutton">
//                             Log In
//                         </button>
//                        </form>
//                        <div class="or-container">
//                           <span class="line"></span>
//                           <span class="or-text">OR</span>
//                           <span class="line"></span>
//                         </div>
//                         <div class="signin-container">
//                          <span class="signin-title">Sign In With</span>
//                          <div class="icons-container">
//                            <i class="fab fa-google signin-icon"></i>
//                            <i class="fab fa-facebook signin-icon"></i>
//                            <i class="fab fa-apple signin-icon"></i>
//                          </div>
//                        </div>
//                        <div class="remember-me-container">
//   <input type="checkbox" id="remember-me" class="remember-checkbox" />
//   <label for="remember-me" class="remember-label">
//     Remember Me
//   </label>
// </div>




                       
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default UserLogin;

