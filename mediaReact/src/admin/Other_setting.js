import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../App.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";
const Mobile_setting = () => {

  
    // ---------------------Admin functions -------------------------------
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [users, setUsers] = useState([]);
  const name = sessionStorage.getItem('username');
  
 

      //===========================================API--G================================================================
  const [Appstore, setAppstore] = useState('');
  const changeAppstoreHandler = (event) => {
    const newValue = event.target.value;
    setAppstore(newValue); // Updating the state using the setter function from useState
  };
  const [Playstore, setPlaystore] = useState('');
  const changePlaystoreHandler = (event) => {
    const newValue = event.target.value;
    setPlaystore(newValue); // Updating the state using the setter function from useState
  };
  const save = (e) => {
    e.preventDefault();
    let SiteSetting = { appstore: Appstore, playstore: Playstore};
    console.log("employee =>"+JSON.stringify(SiteSetting));
    Employee.setOthersettings(SiteSetting).then(res => {
      setAppstore('');
      setPlaystore('');
 
    })
  }

  return (

    <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem" }}>

       <Sidebar />
      <div className="container-fluid"   >
        <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Other Settings</li>
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
              Appstore
                </label>
              <input type="text" placeholder=" Appstore" name=" Appstore" value={Appstore} onChange={changeAppstoreHandler} />
                        </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label className="custom-label">
              Playstore
               </label>
              <input type="text" placeholder=" Playstore" name="Playstore" value={Playstore} onChange={changePlaystoreHandler} />
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
    </div>
  );
};

export default Mobile_setting;
