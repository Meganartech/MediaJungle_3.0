import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../App.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";
const SEO_setting = () => {

  
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


  return (

  
      <div className="container-fluid"   >
        <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">SEO Settings</li>
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

export default SEO_setting;
