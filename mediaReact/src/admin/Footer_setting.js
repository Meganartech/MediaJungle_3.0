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
const Footer_setting = () => {

  
    // ---------------------Admin functions -------------------------------
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [users, setUsers] = useState([]);
  const name = sessionStorage.getItem('username');


    //===========================================API--G================================================================
    const [Meta_Title, setMeta_Title] = useState('');
    const changeMeta_TitleHandler = (event) => {
      const newValue = event.target.value;
      setMeta_Title(newValue); // Updating the state using the setter function from useState
  };
  const [Meta_Author, setMeta_Author] = useState('');
    const changeMeta_AuthorHandler = (event) => {
      const newValue = event.target.value;
      setMeta_Author(newValue); // Updating the state using the setter function from useState
  };
  const [Meta_Keywords, setMeta_Keywords] = useState('');
    const changeMeta_KeywordsHandler = (event) => {
      const newValue = event.target.value;
      setMeta_Keywords(newValue); // Updating the state using the setter function from useState
  };
  const [Meta_Description, setMeta_Description] = useState('');
    const changeMeta_DescriptionHandler = (event) => {
      const newValue = event.target.value;
      setMeta_Description(newValue); // Updating the state using the setter function from useState
  };
  const save=(e)=>{
    e.preventDefault();        
    let SiteSetting={meta_title: Meta_Title,meta_author: Meta_Author,meta_keywords: Meta_Keywords,meta_description: Meta_Description};
    console.log('employee =>'+JSON.stringify(SiteSetting));
    Employee.setseoSettings(SiteSetting).then(res =>{
      setMeta_Author('')
      setMeta_Title('')
      setMeta_Description('')
      setMeta_Keywords('')
  

    })
    
}

const [isOpen, setIsOpen] = useState(false);
const [selectedSetting, setSelectedSetting] = useState("Footer Settings"); // Default selected setting

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
          <li className="breadcrumb-item active  text-white">Footer Settings</li>
        </ol>
        <div className="table-container">           
        <div className="card-body">
        <div class="temp">
        
          {/* <div class="col col-lg-2">
        <Setting_sidebar />
        </div> */}
        <div class="col col-lg-9">
        <ul className='breadcrumb-item' style={{paddingLeft: '0px'}}>
        <form onSubmit={save} method="post" className="registration-form">
                {/* About Us Section */}
                <h3 style={{fontFamily:"sans-serif",fontSize:"24px",fontWeight:"bolder"}}>About Us</h3>
                <label style={{fontWeight:"bold"}}>Header Script</label>
                <input type="text" name="aboutHeading" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>Body Script</label>
                <input type="text" name="aboutBodyScript" className="form-control mb-3" />

                <h4 style={{fontFamily:"sans-serif",fontWeight:"bolder"}}>Feature Box1</h4>
                <label style={{fontWeight:"bold"}}>Header Script</label>
                <input type="text" name="feature1Heading" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>Body Script</label>
                <input type="text" name="feature1BodyScript" className="form-control mb-3" />

                {/* Feature Box 2 */}
                <h4 style={{fontFamily:"sans-serif",fontWeight:"bolder"}}>Feature Box2</h4>
                <label style={{fontWeight:"bold"}}>Header Script</label>
                <input type="text" name="feature2Heading" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>Body Script</label>
                <input type="text" name="feature2BodyScript" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>About Us Image</label>
                <input type="file" name="feature2Image" className="form-control mb-3" />

                {/* Contact Us Section */}
                <h3 style={{fontFamily:"sans-serif",fontSize:"24px",fontWeight:"bolder"}}>Contact Us</h3>
                <label style={{fontWeight:"bold"}}>Email</label>
                <input type="email" name="contactEmail" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>Body Script</label>
                <input type="text" name="contactEmailScript" className="form-control mb-3" />

                <h4 style={{fontFamily:"sans-serif",fontSize:"24px",fontWeight:"bolder"}}>Call Us</h4>
                <label style={{fontWeight:"bold"}}>Phone Number</label>
                <input type="text" name="phoneNumber" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>Body Script</label>
                <input type="text" name="phoneBodyScript" className="form-control mb-3" />

                <h4 style={{fontFamily:"sans-serif",fontSize:"24px",fontWeight:"bolder"}}>Location</h4>
                <label style={{fontWeight:"bold"}}>Map URL</label>
                <input type="text" name="mapUrl" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>Address</label>
                <input type="text" name="address" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>Contact Us Image</label>
                <input type="file" name="contactUsImage" className="form-control mb-3" />

                {/* App URLs Section */}
                <h4 style={{fontFamily:"sans-serif",fontSize:"24px",fontWeight:"bolder"}}>App Url</h4>
                <label style={{fontWeight:"bold"}}>Playstore URL</label>
                <input type="url" name="playstoreUrl" className="form-control mb-3" />
                <label style={{fontWeight:"bold"}}>App Store URL</label>
                <input type="url" name="appStoreUrl" className="form-control mb-3" />

                {/* Copyright Section */}
                <h4 style={{fontFamily:"sans-serif",fontSize:"24px",fontWeight:"bolder"}}>Copyright Content</h4>
                <label style={{fontWeight:"bold"}}>CopyRight Info</label>
                <input type="text" name="copyrightText" className="form-control mb-3" />

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary mt-3">
                  Submit
                </button>
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

export default Footer_setting;
