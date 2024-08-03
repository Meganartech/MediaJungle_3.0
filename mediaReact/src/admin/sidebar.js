import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../css/Sidebar.css";
import API_URL from '../Config';
import axios from 'axios';
import Notification from '../Notification';


const Sidebar = ({ activeLink, setActiveLink}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isvalid, setIsvalid] = useState();
  const [isEmpty, setIsEmpty] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const[count,setcount]=useState(0);
  const [isopen,setisopen]=useState(false);
  
  const token =sessionStorage.getItem("tokenn");
  console.log("token",token)

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/unreadCount`, {
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
        const markread = await axios.post(`${API_URL}/api/v2/markAllAsRead`, {}, {
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
  useEffect(() => {
   

    fetch(`${API_URL}/api/v2/GetAllUser`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
          .then(data => {
            setIsEmpty(data.empty);
            setIsvalid(data.valid);
            const type = data.type;
            // data.dataList.map((item, index) => {
              // console.log("key 1"+data.dataList[0].key1);
              // console.log("value 1"+data.dataList[0].key2);
            // });


      sessionStorage.setItem('type',type);
     
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
}, [location.pathname, setActiveLink]);

  // const handleLogout = () => {
  //   let ab = false;
  //   sessionStorage.setItem("name", ab);
  //   navigate('/admin');
  // };

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("tokenn"); // Retrieve token from session storage
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
        // Send logout request to the server
        const response = await fetch(`${API_URL}/api/v2/logout/admin`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            "Content-Type": "application/json", // Add any other necessary headers
          },
          // Add any necessary body data here
        });
  
        if (response.ok) {
          // Clear token from session storage after successful logout
          sessionStorage.removeItem("tokenn");
          sessionStorage.removeItem("username")
          localStorage.clear();
          sessionStorage.setItem('name', false);
          navigate('/admin');
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
    setDropdownOpen(!dropdownOpen);
  };


  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };
//   const handleClick = (link) => {
//     navigate(link); // Navigate dynamically based on the link parameter
//     console.log(link);
// };

  const handleClick = (link) => {
    setActiveLink(link);
    localStorage.setItem('activeLink', link); // Store the active link in local storage
    
    if((link==="/admin/About_us" || link==="/admin/Dashboard")&& isEmpty)
    {
      // console.log("!isEmpty"+isEmpty+"isvalid"+isvalid+"!isEmpty"+!isEmpty)
      navigate(link);
    }
    else if ((link==="/admin/About_us" || link==="/admin/Dashboard")&& !isEmpty && !isvalid) 
    {
      
        navigate(link);
    } 
    else if (!isEmpty && isvalid)
     {
      
        navigate(link);
    } 
  }
// };
  const name=sessionStorage.getItem('username');
  const b=3;
  // alert(name);

  const handleToggleDropdown = (dropdown) => {
    setIsDropdownOpen(prev => (prev === dropdown ? null : dropdown));
  };
  

  return (
    
<div>
  <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark logo">
    <a className="navbar-brand ps-3" href="./Dashboard.js" style={{ margin: '0px', padding: '0px'   }}></a>
    <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!" onClick={toggleSidebar}>
      <i className="fas fa-bars"></i>
    </button>
    <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon2"
        />
        <button className="btn btn-outline-secondary" type="button">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </form>


    <div className="notification-icon ms-3">
  <button className="btn btn-outline-secondary position-relative" type="button">
    <a onClick={() => { setisopen(!isopen); }} href="#">
      <i className="fas fa-bell"></i>
    </a>
    {count > 0 && (
      <span className="notification-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {count}
      </span>
    )}
  </button>
</div>


        
    <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
      <li className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}>
        <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" onClick={toggleDropdown} aria-expanded={dropdownOpen}>
          <i className="fas fa-user fa-fw"></i>
        </a>
        <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
          <li>
            <a className="dropdown-item" href="change-password.php">
              Change Password
            </a>
          </li>
          <li>
            <button className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>


      <ul className={`navbar-nav sidebar sidebar-dark accordion ${isActive ? 'active' : ''}`} id="content-wrapper">
      <div className="sidebar-logo mb-3 text-center">
    <img src="/mediajungle.png" alt="Logo" className="logo-img" style={{height:'120px',width:'180px'}}/>
  </div>

      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Menu </div>
      </div> */}
      <li className={`nav-item  ${activeLink === "/admin/Dashboard" ? 'active' : ''}`} onClick={() => handleClick("/admin/Dashboard")}>
        <Link className="nav-link" >
        <i class="bi bi-speedometer"></i>
            <span >  Dashboard</span>
        </Link>
      </li> 
    {/* <li className={`nav-item  ${activeLink === "/admin/AddUser" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddUser")}>
      <Link className="nav-link text-white">
          <i className="fas fa-tachometer-alt"></i>
        <span>Add Subadmin</span>
      </Link>
  </li>  */}
    <li className={`nav-item ${isDropdownOpen === 'userAdmin' ? 'show' : ''}`}>
                <div className="nav-link" onClick={() => handleToggleDropdown('userAdmin')}>
                <i class="bi bi-people"></i>
                    <span>Admin & User</span>
                    <i className={`fas fa-chevron-${isDropdownOpen === 'userAdmin' ? 'down' : 'right'} ml-auto`}></i>
                </div>
                {isDropdownOpen === 'userAdmin' && (
                           <ul className="nav flex-column pl-3">
      <li className={`nav-item  ${activeLink === "/admin/Profile" ? 'active' : ''}`} onClick={() => handleClick("/admin/Profile")}>
          <Link className="nav-link" >
              <i className="fas fa-user"></i>
            <span>Sub Admin</span>
          </Link>
      </li>
      <li className={`nav-item  ${activeLink === "/admin/SubscriptionPayments" ? 'active' : ''}`} onClick={() => handleClick("/admin/SubscriptionPayments")}>
          <Link className="nav-link" >
          <i class="bi bi-person-circle"></i>
            <span>  User</span>
          </Link>
      </li>      </ul>
                )}
            </li>
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Video</div>
      </div> */}
       <li className={`nav-item ${isDropdownOpen === 'media' ? 'show' : ''}`}>
                <div className="nav-link" onClick={() => handleToggleDropdown('media')}>
                <i class="bi bi-collection-play"></i>
                    <span>Media</span>
                    <i className={`fas fa-chevron-${isDropdownOpen === 'media' ?  'down' : 'right'} ml-auto`}></i>
                </div>
                {isDropdownOpen === 'media' && (
                   <ul className="nav flex-column pl-3">
      <li className={`nav-item  ${activeLink === "/admin/Video" ? 'active' : ''}`} onClick={() => handleClick("/admin/Video")}>
          <Link className="nav-link" >
          <i class="bi bi-camera-video-fill"></i>
            <span>  Video</span>
          </Link>
      </li>  
       <li className={`nav-item  ${activeLink === "/admin/ListAudio" ? 'active' : ''}`} onClick={() => handleClick("/admin/ListAudio")}>
       <Link className="nav-link" >
       <i class="bi bi-music-note"></i>
         <span> Audio</span>
       </Link>
   </li>
   <li className={`nav-item  ${activeLink === "/admin/Viewcastandcrew" ? 'active' : ''}`} onClick={() => handleClick("/admin/Viewcastandcrew")}>
          <Link className="nav-link" to="#">
          <i class="bi bi-people-fill"></i>
            <span>  Cast & Crew</span>
          </Link>
      </li>          </ul>
                )}
            </li>
      {/* <li className={`nav-item  ${activeLink === "/admin/AddVideo" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddVideo")}>
            <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> Add Video</span>
            </Link>
      </li> */}
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Audio</div>
      </div> */}
     
      {/* <li className={`nav-item  ${activeLink === "/admin/AddAudio" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddAudio")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> Add Audio</span>
          </Link>
      </li> */}
     
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Category</div>
      </div> */}
      {/* <li className={`nav-item  ${activeLink === "/admin/AddCategory" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddCategory")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Category</span>
          </Link>
      </li> */}
       <li className={`nav-item ${isDropdownOpen === 'cattags' ? 'show' : ''}`}>
                <div className="nav-link"  onClick={() => handleToggleDropdown('cattags')}>
                <i class="bi bi-list-ul"></i>
                    <span>Category & Tags</span>
                      <i className={`fas fa-chevron-${isDropdownOpen === 'cattags' ?'down' : 'right'} ml-auto`}></i>
                </div>
                {isDropdownOpen === 'cattags' && (
                    <ul className="nav flex-column pl-3">
      <li className={`nav-item  ${activeLink === "/admin/ViewCategory" ? 'active' : ''}`} onClick={() => handleClick("/admin/ViewCategory")}>
          <Link className="nav-link" >
          <i class="bi bi-grid-fill"></i>
            <span>  Categories</span>
          </Link>
      </li>
     
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Tag</div>
      </div> */}
      {/* <li className={`nav-item  ${activeLink === "/admin/AddTag" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddTag")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Tag</span>
          </Link>
      </li> */}
      <li className={`nav-item  ${activeLink === "/admin/ViewTag" ? 'active' : ''}`} onClick={() => handleClick("/admin/ViewTag")}>
          <Link className="nav-link" >
          <i class="bi bi-tags-fill"></i>
            <span>  Tags</span>
          </Link>
      </li></ul>)} </li>
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Cast & Crew</div>
      </div> */}
      {/* <li className={`nav-item  ${activeLink === "/admin/AddCastCrew" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddCastCrew")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Cast & Crew</span>
          </Link>
      </li> */}
      {/* <li className={`nav-item  ${activeLink === "/admin/Viewcastandcrew" ? 'active' : ''}`} onClick={() => handleClick("/admin/Viewcastandcrew")}>
          <Link className="nav-link text-white" to="#">
              <i className="fas fa-upload"></i>
            <span>  Cast & Crew</span>
          </Link>
      </li> */}
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Language</div>
      </div> */}
      {/* <li className={`nav-item  ${activeLink === "/admin/AddLanguage" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddLanguage")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Langugae</span>
          </Link>
      </li> */}
      
<li className={`nav-item ${isDropdownOpen === 'langcerti' ? 'show' : ''}`}>
                <div className="nav-link" onClick={() => handleToggleDropdown('langcerti')}>
                <i class="bi bi-info-square"></i>
                    <span>Lang & Certi</span>
                    <i className={`fas fa-chevron-${isDropdownOpen === 'langcerti' ? 'down' : 'right'} ml-auto`}></i>
                </div>
                {isDropdownOpen === 'langcerti' && (
                    <ul className="nav flex-column pl-3">
      <li className={`nav-item  ${activeLink === "/admin/ViewLanguage" ? 'active' : ''}`} onClick={() => handleClick("/admin/ViewLanguage")}>
          <Link className="nav-link" >
          <i class="bi bi-translate"></i>
            <span>  Language</span>
          </Link>
      </li>

      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Certificate</div>
      </div> */}
      {/* <li className={`nav-item  ${activeLink === "/admin/AddCertificate" ? 'active' : ''}`} onClick={() => handleClick("/admin/AddCertificate")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Certificate</span>
          </Link>
      </li> */}
      <li className={`nav-item  ${activeLink === "/admin/ViewCertificate" ? 'active' : ''}`} onClick={() => handleClick("/admin/ViewCertificate")}>
          <Link className="nav-link" >
          <i class="bi bi-award-fill"></i>
            <span>  Certificate</span>
          </Link>
      </li>
      </ul>
                )}
            </li>
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Payments</div>
      </div> */}
      {/* <li className={`nav-item  ${activeLink === "/admin/Adminplan" ? 'active' : ''}`} onClick={() => handleClick("/admin/Adminplan")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span>PlanDetails</span>
          </Link>
      </li> */}
<li className={`nav-item ${isDropdownOpen === 'plantenure' ? 'show' : ''}`}>
                <div className="nav-link"onClick={() => handleToggleDropdown('plantenure')}>
                <i class="bi bi-calendar"></i> 

                    <span>Plans & Tenures</span>
                    
                    <i className={`fas fa-chevron-${isDropdownOpen === 'plantenure' ? 'down' : 'right'} ml-auto`}></i>
                </div>
                {isDropdownOpen === 'plantenure' && (
                    <ul className="nav flex-column pl-3">
      <li className={`nav-item  ${activeLink === "/admin/PlanDetailsList" ? 'active' : ''}`} onClick={() => handleClick("/admin/PlanDetailsList")}>
          <Link className="nav-link" >
          <i class="bi bi-clipboard"></i> 

            <span>  Plans</span>
          </Link>
      </li>
      <li className={`nav-item  ${activeLink === "/admin/TenureList" ? 'active' : ''}`} onClick={() => handleClick("/admin/TenureList")}>
          <Link className="nav-link" >
          <i class="bi bi-hourglass"></i>

            <span>  Tenures</span>
          </Link>
      </li>
      </ul>
                )}
            </li>
      {/* <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Settings</div>
      </div> */}
      <li className={`nav-item  ${activeLink === "/admin/Setting" ? 'active' : ''}`} onClick={() => handleClick("/admin/Setting")}>
          <Link className="nav-link" >
          <i class="bi bi-gear-fill"></i>
            <span> Settings</span>
          </Link>
      </li>
      <li className={`nav-item  ${activeLink === "/admin/About_us" ? 'active' : ''}`} onClick={() => handleClick("/admin/About_us")}>
          <Link className="nav-link" >
          <i class="bi bi-house"></i>

            <span> About-Us</span>
          </Link>
      </li>
      
    </ul>

    {isopen && <div>
        <Notification setisopen={setisopen} isopen={isopen} setcount={setcount} handlemarkallasRead={handlemarkallasRead}/>
      
    </div>}

  </div>

  
    
  );
};

export default Sidebar;
