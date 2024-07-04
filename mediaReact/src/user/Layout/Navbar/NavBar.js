import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'
import {FaHeart, FaSearch} from 'react-icons/fa'
import {CgUser} from 'react-icons/cg'
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';
import Swal from 'sweetalert2';

const NavBar = () => {
    const hover = 'hover:text-subMain transitions text-white'
    const Hover =({isActive}) =>(isActive ? 'text-subMain':hover);
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [getall,setGetAll] = useState('');
   const token=sessionStorage.getItem("token")

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

   const handleprofile = async()=>{
    navigate('/UserProfileScreen');
   }

   const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve token from session storage
      if (!token) {
        console.error("Token not found");
        return;
      }
  
      // Display a confirmation dialog using Swal
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
        // Send logout request to the serve
        const response = await fetch(`${API_URL}/api/v2/logout`, {
          method: "POST",
          headers: {
            Authorization: token, // Pass the token in the Authorization header
            "Content-Type": "application/json", // Add any other necessary headers
          },
          // Add any necessary body data here
        });
  
        if (response.ok) {
          // Clear token from session storage after successful logout
          sessionStorage.removeItem("token");
          localStorage.clear();
          // Redirect to login page
          window.location.href = "/UserLogin";
          localStorage.setItem('login', false);
          console.log("Logged out successfully");
          return;
        } else {
          // Handle unsuccessful logout (e.g., server error)
          console.error("Logout failed. Server responded with status:", response.status);
          // Show error message using Swal
          Swal.fire({
            icon: 'error',
            title: 'Logout failed',
            text: 'Please try again later.',
          });
        }
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      // Show error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while logging out. Please try again later.',
      });
    }
  };
  

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

    return (
        <>
            <div className='bg-main shadow-md sticky top-0 z-20' >
                <div className='container mx-auto py-6 px-2 lg:grid gap-10 grid-cols-7 justify-between items-center'style={{height: "93px", zIndex:"20",position: "sticky",marginTop: "-1px"}}>
                <div className='col-span-1 lg:block hidden'>
                {getall.length > 0 && getall[0].logo ? (
                      <Link to="/">
                        <img src={`data:image/png;base64,${getall[0].logo}`} alt='logo' className='w-full object-contain'/>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                  </div>

                    {/* Search Form */}
                    <div className='col-span-3'>
                        <form className='w-full text-sm bg-dryGray rounded flex-btn gap-4'>
                            <button type='submit' className='bg-subMain w-12 flex-colo h-12 rounded text-white'>
                                <FaSearch />
                            </button>
                            <input type='text'placeholder='Search Movie Name from here' className='font-medium placeholder:text-border text-sm w-11/12 h-12 bg-transparent border-none px-2 text-black' />
                        </form>
                    </div>
                    {/* Menus */}
                    <div className='col-span-3 font-medium text-sm hidden xl:gap-14 2xl:gap-10 justify-between lg:flex xl:justify-end items-center'>
                        <NavLink to='/PlanDetails' className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out" style={{width:"120px"}}>
                            SUBSCRIBE
                        </NavLink>
                        <NavLink to='/MoviesPage' className={Hover}>
                            Movies
                        </NavLink>
                        <NavLink to='/AboutUs' className={Hover}>
                            AboutUs
                        </NavLink>
                        <NavLink to='/Contactus' className={Hover}>
                            ContactUs
                        </NavLink>


                        {token!==null ? (
                            <div className="relative">
                            <div className="flex items-center gap-2" onClick={toggleDropdown}>
                                <CgUser className='w-8 h-8' /> 
                            </div>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 bg-yellow-600 rounded shadow-lg">
                                  <button className="block w-full py-2 px-4 text-left text-white" onClick={handleprofile}>profile</button>
                                  
                                <button className="block btn-danger w-full py-2 px-4 text-left text-white" onClick={handleLogout}>Logout</button>
                               
                                 
                              
                                </div>
                                 
                            )}
                            
                            </div>
                        ) : (
                            <>
                            <NavLink to='/UserLogin' className={Hover}>
                               <CgUser className='w-8 h-8' />
                            </NavLink>
                            
                            </>
                        )}






                        




                        {/* <NavLink to='/favorites' className={`${Hover} relative`}>
                            <FaHeart className='w-6 h-6' />
                            <div className='w-5 h-5 flex-colo rounded-full text-xs bg-subMain text-white absolute -top-5 -right-1'>
                                3
                            </div>
                        </NavLink> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar