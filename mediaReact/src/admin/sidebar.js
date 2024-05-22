import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import "../css/Sidebar.css";
const Sidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isvalid, setIsvalid] = useState();
  const [isEmpty, setIsEmpty] = useState();
  const navigate = useNavigate();
  useEffect(() => {
   

    fetch('http://localhost:8080/api/v2/GetAllUser')
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

  const handleLogout = () => {
    let ab = false;
    sessionStorage.setItem("name", ab);
    navigate('/admin');
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
    
    if((link==="/admin/About_us" || link==="/admin/Dashboard")&& isEmpty)
    {
      
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
  return (
    <div>

 <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand ps-3" href="./Dashboard.js" style={{margin:'0px', padding:'0px'}}>Admin Panel</a>
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          &nbsp;
        </div>
      </form>
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
     
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Menu </div>
      </div>
      <li className="nav-item " onClick={() => handleClick("/admin/Dashboard")}>
      {/* <Link className="nav-link text-white" onClick={() => handleClick("/admin/Dashboard")}>
          <i className="fas fa-tachometer-alt"></i>
          
        <span> Dashboard</span>
      </Link> */}
      <Link className="nav-link text-white">
    <i className="fas fa-tachometer-alt"></i>
    <span> Dashboard</span>
</Link>
  </li> 
    <li className="nav-item " onClick={() => handleClick("/admin/AddUser")}>
      <Link className="nav-link text-white">
          <i className="fas fa-tachometer-alt"></i>
        <span>User</span>
      </Link>
  </li> 
    
      <li className="nav-item" onClick={() => handleClick("/admin/Profile")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-user"></i>
            <span> Profile</span>
          </Link>
      </li>
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Video</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/Video")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-video"></i>
            <span> Video</span>
          </Link>
      </li>  
      <li className="nav-item" onClick={() => handleClick("/admin/AddVideo")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> Add Video</span>
          </Link>
      </li>
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Audio</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/ListAudio")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-music"></i>
            <span> Audio</span>
          </Link>
      </li>
      <li className="nav-item" onClick={() => handleClick("/admin/AddAudio")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> Add Audio</span>
          </Link>
      </li>
     
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Category</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/AddCategory")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Category</span>
          </Link>
      </li>
      <li className="nav-item" onClick={() => handleClick("/admin/ViewCategory")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> View Category</span>
          </Link>
      </li>
     
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Tag</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/AddTag")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Tag</span>
          </Link>
      </li>
      <li className="nav-item" onClick={() => handleClick("/admin/ViewTag")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> View Tag</span>
          </Link>
      </li>
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Cast & Crew</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/AddCastCrew")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Cast & Crew</span>
          </Link>
      </li>
      <li className="nav-item" onClick={() => handleClick("#")}>
          <Link className="nav-link text-white" to="#">
              <i className="fas fa-upload"></i>
            <span> View Cast & Crew</span>
          </Link>
      </li>
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Language</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/AddLanguage")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Langugae</span>
          </Link>
      </li>
      <li className="nav-item" onClick={() => handleClick("/admin/ViewLanguage")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> View Langugae</span>
          </Link>
      </li>

      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Certificate</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/AddCertificate")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Add Certificate</span>
          </Link>
      </li>
      <li className="nav-item" onClick={() => handleClick("/admin/ViewCertificate")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-upload"></i>
            <span> View Certificate</span>
          </Link>
      </li>

      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Payments</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/SubscriptionPayments")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Subscription Payments</span>
          </Link>
      </li>
      <div className="sb-sidenav-menu-heading bg-primary text-white text-center">
        <div className="sidebar-brand-text mx-3">Settings</div>
      </div>
      <li className="nav-item" onClick={() => handleClick("/admin/Setting")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> Settings</span>
          </Link>
      </li>
      <li className="nav-item" onClick={() => handleClick("/admin/About_us")}>
          <Link className="nav-link text-white" >
              <i className="fas fa-photo-video"></i>
            <span> About-Us</span>
          </Link>
      </li>
      
    </ul>

  </div>
    
  );
};

export default Sidebar;
