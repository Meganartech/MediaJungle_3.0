import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../App.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";
const Social_setting = () => {

  //===========================================API--G================================================================
  const [FBclientid, setFBclientid] = useState('');
  const changeFBclientidHandler = (event) => {
    const newValue = event.target.value;
    setFBclientid(newValue); 
  };
  const [FBclientsecret, setFBclientsecret] = useState('');
  const changeFBclientsecretHandler = (event) => {
    const newValue = event.target.value;
    setFBclientsecret(newValue); 
  };
  const [FBcallBack, setFBcallBack] = useState('');
  const changeFBcallBackHandler = (event) => {
    const newValue = event.target.value;
    setFBcallBack(newValue); 
  };
  const [Google_Client_Id, setGoogle_Client_Id] = useState('');
  const changeGoogle_Client_IdHandler = (event) => {
    const newValue = event.target.value;
    setGoogle_Client_Id(newValue); 
  };
  const [Google_Client_Secret, setGoogle_Client_Secret] = useState('');
  const changeGoogle_Client_SecretHandler = (event) => {
    const newValue = event.target.value;
    setGoogle_Client_Secret(newValue); 
  };
  const [Google_CallBack, setGoogle_CallBack] = useState('');
  const changeGoogle_CallBackHandler = (event) => {
    const newValue = event.target.value;
    setGoogle_CallBack(newValue); 
  };
  const save = (e) => {
    e.preventDefault();
    let SiteSetting = { googl_client_back: Google_CallBack, googl_client_secret: Google_Client_Secret,googl_client_id: Google_Client_Id, fb_call_back: FBcallBack,fb_client_secret: FBclientsecret, fb_client_id: FBclientid };
    console.log('employee =>'+JSON.stringify(SiteSetting));
    Employee.setSocialsettings(SiteSetting).then(res => {
      setGoogle_CallBack('');
      setGoogle_Client_Secret('');
      setGoogle_Client_Id('');
      setFBcallBack('');
      setFBclientsecret('');
      setFBclientid('');
    })
  }

  return (

      <div className="container-fluid"   >
        <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Social Settings</li>
        </ol>
        <div className="card md-8" style={{ maxWidth: '91rem', paddingLeft: '0px' }}>
          <div className="container card-body">
            <div class="temp">
              <div class="col col-lg-2">
                <Setting_sidebar />
              </div>
              <div class="col col-lg-9">
                <ul className='breadcrumb-item' style={{ paddingLeft: '0px' }}>
                  <form onSubmit="" method="post" className="registration-form">
                    <div className="temp">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            FB Settings
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            FB Client Id
                          </label>
                          <input type="text" placeholder="FB Client Id" name="FB Client Id" value={FBclientid} onChange={changeFBclientidHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            FB Client Secret
                          </label>
                          <input type="text" placeholder="FB Client Secret" name="FB Client Secret" value={FBclientsecret} onChange={changeFBclientsecretHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            FB CallBack
                          </label>
                          <input type="text" placeholder="FB CallBack" name="FB CallBack" value={FBcallBack} onChange={changeFBcallBackHandler} />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            Google Settings
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Google Client Id
                          </label>
                          <input type="text" placeholder="Google Client Id" name="Google Client Id" value={Google_Client_Id} onChange={changeGoogle_Client_IdHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Google Client Secret
                          </label>
                          <input type="text" placeholder="Google Client Secret" name="Google Client Secret" value={Google_Client_Secret} onChange={changeGoogle_Client_SecretHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Google CallBack
                          </label>
                          <input type="text" placeholder="Google CallBack" name="Google CallBack" value={Google_CallBack} onChange={changeGoogle_CallBackHandler} />
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

export default Social_setting;
