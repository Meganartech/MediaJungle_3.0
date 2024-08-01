import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Setting_sidebar from './Setting_sidebar';
import API_URL from '../Config';
import Swal from 'sweetalert2'
import "../css/Sidebar.css";
import axios from 'axios';

const Setting = () => {
  
  return (
    <div className="container-fluid con-flu">
      <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/admin/Setting">Settings</Link>
          </li>
          {/* <li className="breadcrumb-item active  text-white">Site Settings</li> */}
        </ol>
        <div className="card md-8" style={{ margin: '0px', maxWidth: '91rem', padding: '0px' }}>
          <div className="container card-body">
            <div className="temp">
              <div className="col col-lg-2">
                <Setting_sidebar />
              </div>
              {/* <div className="col col-lg-9">
                <ul className='breadcrumb-item' style={{ paddingLeft: '0px' }}>
                  <form onSubmit={handleFormSubmit} method="post" className="registration-form">
                    <div className="temp">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">Site Name</label>
                          <input
                            type="text"
                            placeholder={sitenamePlaceholder}
                            name="sitename"
                            value={sitename}
                            onChange={(e) => setsitename(e.target.value)}
                          />
                          {error.sitename && <div className="error-message error">{error.sitename}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">App URL</label>
                          <input
                            type="text"
                            placeholder={appurlPlaceholder}
                            name="appurl"
                            value={appurl}
                            onChange={(e) => setappurl(e.target.value)}
                          />
                          {error.appurl && <div className="error-message error">{error.appurl}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">Logo</label>
                          {logoUrl && <img src={logoUrl} alt="Logo Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
                          <input type="file" name="logo" onChange={changeLogoHandler} /> 
                          {error.logo && <div className="error-message error">{error.logo}</div>}
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">Icon</label>
                          {iconUrl && <img src={iconUrl} alt="Icon Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
                          <input type="file" name="icon" onChange={changeIconHandler} />
                          {error.icon && <div className="error-message error">{error.icon}</div>}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">Tag Name</label>
                          <input
                            type="text"
                            placeholder={tagnamePlaceholder}
                            name="tagname"
                            value={tagname}
                            onChange={(e) => settagname(e.target.value)}
                          />
                          {error.tagname && <div className="error-message error">{error.tagname}</div>}
                        </div>
                      </div>
                     
                      <div className='col-lg-12'>
                        <div className="d-flex justify-content-center" style={{ marginTop: "10px" }}>
                          <button className='text-center btn btn-info'>
                            {buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Setting;
