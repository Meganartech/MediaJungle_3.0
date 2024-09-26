import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'
import {FaHeart, FaSearch,FaBell} from 'react-icons/fa'
import {CgUser} from 'react-icons/cg'
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';
import Swal from 'sweetalert2';
import axios from 'axios';
import UserNotification from '../../Screens/UserNotification';
const NavBar = () => {
    const hover = 'hover:text-subMain transitions text-white'
    const Hover =({isActive}) =>(isActive ? 'text-subMain':hover);
    const navigate = useNavigate();
    const[count,setcount]=useState(0);
    const [isopen,setisopen]=useState(false);

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
          sessionStorage.removeItem("userId");
          sessionStorage.removeItem("name");
          // sessionStorage.removeItem("initialsignup");
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

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/unreadCountuser`, {
        headers: {
          Authorization: token,
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
        setcount(data);
        console.log("count",data)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handlemarkallasRead = async () => {
    try {
        const markread = await axios.post(`${API_URL}/api/v2/markAllAsReaduser`, {}, {
            headers: {
                Authorization: token,
            },
        });
        
        if (markread.status === 200) {
            fetchUnreadCount();
        }
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
};

useEffect(() => { 
  // Fetch initially
  fetchUnreadCount();
  // Cleanup for interval
}, [count]); 

    return (
        <>
            <div className='bg-custom-color shadow-md sticky z-20'  >
            <div className='con5 mx-auto lg:grid gap-20 grid-cols-7 justify-between items-center' style={{ height: "93px", zIndex: "20", position: "sticky", marginTop: "-1px" }}>
  <div className='col-span-1 lg:block hidden'>
    {getall.length > 0 && getall[0].logo ? (
      <Link to="/">
        <img src={`data:image/png;base64,${getall[0].logo}`} alt='logo' className='w-full object-contain' />
      </Link>
    ) : (
      <div></div>
    )}
  </div>

  {/* Centered Search Form */}
  <div className='col-span-5 flex justify-center items-center'>
    <form className='w-full max-w-md text-sm bg-dryGray rounded flex gap-4 items-center'>
      <button type='submit' className=' w-12 flex-colo h-12 rounded text-black'>
        <FaSearch />
      </button>
      <input
        type='text'
        placeholder='Search...'
        className='font-medium placeholder:text-border text-sm w-full h-12 bg-transparent border-none px-2 text-black'
      />
    </form>
  </div>

  {/* Menus */}
  <div className='col-span-1 font-medium text-sm hidden xl:gap-14 2xl:gap-10 justify-between lg:flex xl:justify-end items-center'>
    <div className="relative cursor-pointer mr-2" onClick={() => { setisopen(!isopen); }}>
      <div className="relative">
        {count > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
        <a onClick={() => { setisopen(!isopen); }} href="#">
          <FaBell className='w-6 h-6 text-white hover:text-red-900 transition duration-300 ease-in-out' />
        </a>
      </div>
    </div>
    {token !== null ? (
      <div className="relative">
        <div className="flex items-center gap-2" onClick={toggleDropdown}>
          <CgUser className='w-8 h-8' />
        </div>
        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-red-600 rounded shadow-lg">
            <button className="block w-full py-2 px-4 text-left text-white" onClick={handleprofile}>Profile</button>
            <button className="block btn-danger w-full py-2 px-4 text-left text-white" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    ) : (
      <NavLink to='/UserLogin' className={Hover}>
        <CgUser className='w-8 h-8' />
      </NavLink>
    )}
  </div>
</div>

               
                {isopen && <div>
                  <UserNotification setisopen={setisopen} isopen={isopen} setcount={setcount} handlemarkallasRead={handlemarkallasRead}/>
                  </div>}
            </div>
            <div className='con5' style={{ background: 'linear-gradient(to top, #141335, #0c0d1a)'}}> 
            <NavLink to='/' className={Hover}>
                            Movies
                        </NavLink>
                        <NavLink to='/AudioHomecreeen' className={Hover}>
                            Music
                        </NavLink>
                        <NavLink to='#' className={Hover}>
                            Library
                        </NavLink>
                        <div style={{padding:'50px'}}>
                        <NavLink 
  to='/PlanDetails' 
  className="bg-new hover:bg-red-900 text-white py-2 px-8 rounded-lg w-full transition duration-300 ease-in-out"
>
  SUBSCRIBE
</NavLink>
</div>
            </div>
        </>
    )
}

export default NavBar