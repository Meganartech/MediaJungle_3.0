import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../App.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";

const Contact_setting = () => {
    
   
     //===========================================API--G================================================================
     const [Contact_Email, setContact_Email] = useState('');
     const changeContact_EmailHandler = (event) => {
       const newValue = event.target.value;
       setContact_Email(newValue); // Updating the state using the setter function from useState
   };
   const [Contact_Mobile, setContact_Mobile] = useState('');
     const changeContact_MobileHandler = (event) => {
       const newValue = event.target.value;
       setContact_Mobile(newValue); // Updating the state using the setter function from useState
   };
   const [Contact_Address, setContact_Address] = useState('');
     const changeContact_AddressHandler = (event) => {
       const newValue = event.target.value;
       setContact_Address(newValue); // Updating the state using the setter function from useState
   };
   const [Copyright_Content, setCopyright_Content] = useState('');
     const changeCopyright_ContentHandler = (event) => {
       const newValue = event.target.value;
       setCopyright_Content(newValue); // Updating the state using the setter function from useState
   };
   const save=(e)=>{
     e.preventDefault();        
     let SiteSetting={contact_email: Contact_Email,contact_mobile: Contact_Mobile,contact_address: Contact_Address,copyright_content:Copyright_Content};
     console.log('employee =>'+JSON.stringify(SiteSetting));
     Employee.setContactsettings(SiteSetting).then(res =>{
       setCopyright_Content('')
       setContact_Mobile('')
       setContact_Email('')
       setContact_Address('')
   
 
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
          <li className="breadcrumb-item active">Contact Settings</li>
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
              Contact Email
                </label>
                <input type="text" placeholder="Contact Email" name="Contact Email" value={Contact_Email} onChange={changeContact_EmailHandler} />
              </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label className="custom-label">
              Contact Mobile
                </label>
                <input type="text" placeholder="Contact Mobile" name="Contact Mobile" value={Contact_Mobile} onChange={changeContact_MobileHandler} />
              </div>
          </div>
          <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Contact Address
              </label>
              <input type="text" placeholder="Contact Address" name="Contact Address" value={Contact_Address} onChange={changeContact_AddressHandler} />
              </div>
          </div>
        
        <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Copyright Content
               </label>
               <input type="text" placeholder="Copyright Content" name="Copyright Content" value={Copyright_Content} onChange={changeCopyright_ContentHandler} />
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

export default Contact_setting;
