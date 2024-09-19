import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../App.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";
import { Dropdown } from 'react-bootstrap';
const Banner_setting= () => {

  
    // ---------------------Admin functions -------------------------------
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [users, setUsers] = useState([]);
  const name = sessionStorage.getItem('username');

 
   
 
    //===========================================API--G================================================================
  const [Google_Analytics, setGoogle_Analytics] = useState('');
  const changeGoogle_AnalyticsHandler = (event) => {
    const newValue = event.target.value;
    setGoogle_Analytics(newValue); // Updating the state using the setter function from useState
  };
  const [Header_Scripts, setHeader_Scripts] = useState('');
  const changeHeader_ScriptsHandler = (event) => {
    const newValue = event.target.value;
    setHeader_Scripts(newValue); // Updating the state using the setter function from useState
  };
  const [Body_Scripts, setBody_Scripts] = useState('');
  const changeBody_ScriptsHandler = (event) => {
    const newValue = event.target.value;
    setBody_Scripts(newValue); // Updating the state using the setter function from useState
  };
  const save = (e) => {
    e.preventDefault();
    let SiteSetting = { google_analytics: Google_Analytics, header_scripts: Header_Scripts, body_scripts: Body_Scripts };
    console.log("employee =>"+JSON.stringify(SiteSetting));
    Employee.setMobilesettings(SiteSetting).then(res => {
      setGoogle_Analytics('');
      setHeader_Scripts('');
      setBody_Scripts('');
    })
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("Banner Settings"); // Default selected setting

  const settingsOptions = [
    { name: "Site Settings", path: "/admin/SiteSetting" },
    { name: "Social Settings", path: "/admin/Social_setting" },
    { name: "Payment Settings", path: "/admin/Payment_setting" },
    { name: "Banner Settings", path: "/admin/Banner_setting" },
    { name: "Footer Settings", path: "/admin/Footer_setting" },
    { name: "Contact Settings", path: "/admin/Contact_setting" }
  ];

  const handleSettingChange = (setting) => {
    setSelectedSetting(setting.name);
    setIsOpen(false);
    
  };
  return (
    <div className="marquee-container">
    <div className='AddArea'>
      {/* Dropdown for settings */}
      <Dropdown 
      className="mb-4" 
      show={isOpen} 
      onToggle={() => setIsOpen(!isOpen)} // Toggle the dropdown
    >
      <Dropdown.Toggle
     
        className={`${
          isOpen ? 'bg-custom-color text-orange-600' : 'bg-custom-color'
        } hover:bg-custom-color hover:text-orange-600`}
      >
        {selectedSetting}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {settingsOptions.map((setting, index) => (
          <Dropdown.Item
            as={Link}
            to={setting.path}
            key={index}
            onClick={() => handleSettingChange(setting)}
          >
            {setting.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
    </div>
    <br />
    <div className='container2 mt-2'>
        <ol className="breadcrumb mb-4 d-flex my-0">
          <li className="breadcrumb-item">
            <Link to="/admin/SiteSetting">Settings</Link>
          </li>
          <li className="breadcrumb-item active  text-white">Banner Settings</li>
        </ol>
        <div className="table-container">           
          <div className="card-body">
          <div class="temp">
          {/* <div class="col col-lg-2">
        <Setting_sidebar />
        </div> */}
        <div class="col col-lg-9">
        <ul className='breadcrumb-item' style={{paddingLeft: '0px'}}>
        <form onSubmit="" method="post" className="registration-form">
        <div className="temp">
        <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Google Analytics
               </label>
               <input type="text" placeholder=" Google Analytics" name=" Google Analytics" value={Google_Analytics} onChange={changeGoogle_AnalyticsHandler} />
              </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label className="custom-label">
              Header Scripts
              </label>
              <input type="text" placeholder=" Header Scripts" name="Header Scripts" value={Header_Scripts} onChange={changeHeader_ScriptsHandler} />
             </div>
          </div>
          <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Body Scripts
                </label>
                <input type="text" placeholder="Body Scripts" name="Body Scripts" value={Body_Scripts} onChange={changeBody_ScriptsHandler} />
             </div>
          </div>
        
          <div className="col-md-12">
         
          <div className="form-group">
          <input type="submit" className="btn btn-info" name="submit" value="Submit" onClick={save} />
            
               </div>
          </div>
        </div>
        </form>
        </ul>
        </div>
        </div>
        </div>
        </div>
      </div>
   
</div>
  );
};

export default Banner_setting;

