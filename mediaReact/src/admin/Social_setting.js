import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import "../css/Sidebar.css";
import Navbar from './navbar';
import Sidebar from './sidebar';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee';

const Social_setting = () => {
  const [selectedSetting, setSelectedSetting] = useState("Social Settings");
  const [FBclientid, setFBclientid] = useState('');
  const [xurl, setXurl] = useState('');
  const [linkedinurl, setLinkedInUrl] = useState('');
  const [youtubeurl, setYouTubeUrl] = useState('');
  const [id, setId] = useState(null); // To track whether the record exists or not
  const [isOpen, setIsOpen] = useState(false);

  const settingsOptions = [
    { name: "Site Settings", path: "/admin/SiteSetting" },
    { name: "Social Settings", path: "/admin/Social_setting" },
    { name: "Payment Settings", path: "/admin/Payment_setting" },
    { name: "Banner Settings", path: "/admin/Banner_setting" },
    { name: "Footer Settings", path: "/admin/Footer_setting" },
    { name: "Contact Settings", path: "/admin/Contact_setting" }
  ];

  // Fetch the existing social settings when the component loads
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v2/social-settings/12'); // Assuming ID is 1 for this example
        const data = response.data;
        
        if (data) {
          setFBclientid(data.fbUrl || '');
          setXurl(data.xurl || '');
          setLinkedInUrl(data.linkedinUrl || '');
          setYouTubeUrl(data.youtubeUrl || '');
          setId(data.id); // Store the ID for update
        }
      } catch (error) {
        console.error('Error fetching social settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const save = (e) => {
    e.preventDefault();

    const siteSetting = { 
      fbUrl: FBclientid, 
      linkedinUrl: linkedinurl, 
      youtubeUrl: youtubeurl, 
      xurl: xurl 
    };

    console.log('SiteSetting:', siteSetting);

    if (id) {
      // If the setting already exists, send a PUT request to update it
      axios.put(`http://localhost:8080/api/v2/social-settings/${id}`, siteSetting)
        .then(response => {
          console.log('Success:', response.data);
        })
        .catch(error => {
          console.error('Error updating settings:', error);
        });
    } else {
      // If the setting does not exist, send a POST request to create new data
      axios.post('http://localhost:8080/api/v2/social-settings', siteSetting)
        .then(response => {
          console.log('Success:', response.data);
          setId(response.data.id); // Store the ID after creating the new setting
        })
        .catch(error => {
          console.error('Error creating new settings:', error);
        });
    }
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
          onToggle={() => setIsOpen(!isOpen)}
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
              {/* Form container */}
              <div className="col-md-6"> 
                <ul className='breadcrumb-item' style={{ paddingLeft: '0px' }}>
                  <form onSubmit={save} method="post" className="registration-form">
                    <div className="temp">
                      {/* FB URL */}
                      <div className="form-group">
                        <label style={{paddingRight:"110px"}}>
                          FB URL
                        </label>
                        <input 
                          type="text" 
                          placeholder="FB URL" 
                          value={FBclientid} 
                          onChange={(e) => setFBclientid(e.target.value)} 
                        />
                      </div>

                      {/* X URL */}
                      <div className="form-group">
                        <label style={{paddingRight:"120px"}}>
                          X URL
                        </label>
                        <input 
                          type="text" 
                          placeholder="X URL" 
                          value={xurl} 
                          onChange={(e) => setXurl(e.target.value)} 
                        />
                      </div>

                      {/* LinkedIn URL */}
                      <div className="form-group">
                        <label style={{paddingRight:"60px"}}>
                          LinkedIn URL
                        </label>
                        <input 
                          type="text" 
                          placeholder="LinkedIn URL" 
                          value={linkedinurl} 
                          onChange={(e) => setLinkedInUrl(e.target.value)} 
                        />
                      </div>

                      {/* YouTube URL */}
                      <div className="form-group">
                        <label style={{paddingRight:"60px"}}>
                          YouTube URL
                        </label>
                        <input 
                          type="text" 
                          placeholder="YouTube URL" 
                          value={youtubeurl} 
                          onChange={(e) => setYouTubeUrl(e.target.value)} 
                        />
                      </div><br/>
<div className='col-md-12'>
                      <div className="form-group">
                        <input 
                          type="submit" 
                          className="btn btn-info" 
                          value="Submit" 
                        />
                      </div></div>
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
