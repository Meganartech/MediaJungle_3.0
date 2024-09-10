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
const Social_setting = () => {
  const [selectedSetting, setSelectedSetting] = useState("Social Settings"); // Default selected setting

  const settingsOptions = [
    { name: "Site Settings", path: "/admin/SiteSetting" },
    { name: "Social Settings", path: "/admin/Social_setting" },
    { name: "Payment Settings", path: "/admin/Payment_setting" },
    { name: "Banner Settings", path: "/admin/Banner_setting" },
    { name: "Footer Settings", path: "/admin/Footer_setting" },
    { name: "Contact Settings", path: "/admin/Contact_setting" }
  ];

  //===========================================API--G================================================================
  const [FBclientid, setFBclientid] = useState('');
  const changeFBclientidHandler = (event) => {
    const newValue = event.target.value;
    setFBclientid(newValue); 
  };
  const [xurl, setXurl] = useState('');
  const changeXurl = (event) => {
    const newValue = event.target.value;
    setXurl(newValue); 
    console.log(newValue);
  };
  const [linkedinurl, setLinkedInUrl] = useState('');
  const changeLinkedInUrl = (event) => {
    const newValue = event.target.value;
    setLinkedInUrl(newValue); 
  };
  const [youtubeurl, setYouTubeUrl] = useState('');
  const changeYouTubeUrl = (event) => {
    const newValue = event.target.value;
    setYouTubeUrl(newValue); 
  };
  const [Google_Client_Secret, setGoogle_Client_Secret] = useState('');
  const changeGoogle_Client_SecretHandler = (event) => {
    const newValue = event.target.value;
    setGoogle_Client_Secret(newValue); 
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [Google_CallBack, setGoogle_CallBack] = useState('');
  const changeGoogle_CallBackHandler = (event) => {
    const newValue = event.target.value;
    setGoogle_CallBack(newValue); 
  };
  const save = (e) => {
    e.preventDefault();
    let SiteSetting = { 
        fbUrl: FBclientid, 
        linkedinUrl: linkedinurl, 
        youtubeUrl: youtubeurl, 
        xurl: xurl 
    };

    console.log('SiteSetting:', SiteSetting); // Inspect the SiteSetting object

    axios.post('http://localhost:8080/api/v2/social-settings', SiteSetting)
        .then(response => {
            console.log('Success:', response.data);
            // Clear fields
            setFBclientid('');
            setLinkedInUrl('');
            setYouTubeUrl('');
            setXurl('');
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

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
    <div className='container3 mt-2'>
      <ol className="breadcrumb mb-4 d-flex my-0">
        <li className="breadcrumb-item">
          <Link to="/admin/SiteSetting">Settings</Link>
        </li>
        <li className="breadcrumb-item active text-white">Social Settings</li>
      </ol>
      <div className="table-container">
        <div className="card-body">
          <div className="row">
            {/* Form container, now occupying half the width */}
            <div className="col-md-6"> 
              <ul className='breadcrumb-item' style={{ paddingLeft: '0px' }}>
                <form onSubmit={save} method="post" className="registration-form">
                  <div className="temp">
                    {/* FB URL Settings */}
                    <div className="form-group">
                      <label style={{paddingRight:"110px"}}>
                        FB URL
                      </label>
                      <input 
                        type="text" 
                        placeholder="FB URL" 
                        name="FB URL" 
                        value={FBclientid} 
                        onChange={changeFBclientidHandler} 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label  style={{paddingRight:"120px"}}>
                       X URL
                      </label>
                      <input 
    type="text" 
    placeholder="X URL" 
    name="xurl" 
    value={xurl} 
    onChange={changeXurl} 
/>

                    </div>
                    
                    <div className="form-group">
                      <label  style={{paddingRight:"60px"}}>
                      Linked In URL
                      </label>
                      <input 
                        type="text" 
                        placeholder="LinkedIn URL" 
                        name="linkedinurl" 
                        value={linkedinurl} 
                        onChange={changeLinkedInUrl} 
                      />
                    </div>
                    
                    {/* Google Settings */}
                    {/* <div className="form-group">
                      <label className="custom-label" style={{ color: 'black' }}>
                        Google Settings
                      </label>
                    </div> */}
  
                    <div className="form-group">
                      <label  style={{paddingRight:"60px"}}>
                        You Tube URL
                      </label>
                      <input 
                        type="text" 
                        placeholder="youtubeurl" 
                        name="youtubeurl" 
                        value={youtubeurl} 
                        onChange={changeYouTubeUrl} 
                      />
                    </div><br/>
  
                    {/* <div className="form-group">
                      <label className="custom-label">
                        Google Client Secret
                      </label>
                      <input 
                        type="text" 
                        placeholder="Google Client Secret" 
                        name="Google Client Secret" 
                        value={Google_Client_Secret} 
                        onChange={changeGoogle_Client_SecretHandler} 
                      />
                    </div> */}
  
                    {/* <div className="form-group">
                      <label className="custom-label">
                        Google CallBack
                      </label>
                      <input 
                        type="text" 
                        placeholder="Google CallBack" 
                        name="Google CallBack" 
                        value={Google_CallBack} 
                        onChange={changeGoogle_CallBackHandler} 
                      />
                    </div> */}
                    <div className='col-md-12'>
                    <div className="form-group">
                      <input 
                        type="submit" 
                        className="btn btn-info" 
                        name="submit" 
                        value="Submit" 
                        onClick={save} 
                      />
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

export default Social_setting;
