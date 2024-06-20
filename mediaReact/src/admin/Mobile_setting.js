import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../App.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";
const Other_setting= () => {

  
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

  return (

      <div className="container-fluid"   >
        <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Mobile Settings</li>
        </ol>
        <div className="card md-8" style={{maxWidth: '91rem',paddingLeft: '0px'}}>           
          <div className="container card-body">
          <div class="temp">
          <div class="col col-lg-2">
        <Setting_sidebar />
        </div>
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

export default Other_setting;
