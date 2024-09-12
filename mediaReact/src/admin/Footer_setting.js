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
        <form onSubmit="" method="post" className="registration-form">
        <div className="temp">
        <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Meta Title
                </label>
              <input type="text" placeholder="Meta Title" name="Meta Title" value={Meta_Title} onChange={changeMeta_TitleHandler} />
                       </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label className="custom-label">
              Meta Author
              </label>
              <input type="text" placeholder="Meta Author" name="Meta Author" value={Meta_Author} onChange={changeMeta_AuthorHandler} />
                        </div>
          </div>
          <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Meta Keywords
                 </label>
              <input type="text" placeholder="Meta Keywords" name="Meta Keywords" value={Meta_Keywords} onChange={changeMeta_KeywordsHandler} />
                        </div>
          </div>
        
        <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Meta Description
                 </label>
              <input type="text" placeholder="Meta Description" name="Meta Description" value={Meta_Description} onChange={changeMeta_DescriptionHandler} />
                        </div>
          </div>
         
          <div className="col-md-12">
          <div className="form-group" style={{textAlign:'center'}}>
         
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

export default Footer_setting;
