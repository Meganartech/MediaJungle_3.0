import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Setting_sidebar from './Setting_sidebar';
import API_URL from '../Config';
import Swal from 'sweetalert2'
import "../css/Sidebar.css";
import axios from 'axios';

const SiteSetting = () => {
  
  const [sitename, setsitename] = useState('');
  const [appurl, setappurl] = useState('');
  const [tagname, settagname] = useState('');
  const [icon, seticon] = useState('');
  const [logo, setlogo] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [GetAll, setGetAll] = useState('');
  const [buttonText, setButtonText] = useState('ADD');
  const [id, setId] = useState(null);
  const token = sessionStorage.getItem('tokenn')
  const [error,setErrors] = useState('');

  const [sitenamePlaceholder, setsitenamePlaceholder] = useState('SiteName');
  const [appurlPlaceholder, setappurlPlaceholder] = useState('App URL');
  const [tagnamePlaceholder, settagnamePlaceholder] = useState('Tag Name');

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetsiteSettings`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetAll(data);
        console.log(data);
        if (data.length > 0) {
          setButtonText('EDIT');
          setsitenamePlaceholder(data[0].sitename);
          setappurlPlaceholder(data[0].appurl);
          settagnamePlaceholder(data[0].tagName);
          setId(data[0].id);
          setIconUrl(`data:image/jpeg;base64,${data[0].icon}`);  // assuming the images are stored in the "uploads" directory
          setLogoUrl(`data:image/jpeg;base64,${data[0].logo}`);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!sitename.trim()) {
      newErrors.sitename = 'sitename is required';
      isValid = false;
    }

    if (!appurl.trim()) {
      newErrors.appurl = 'appurl is required';
      isValid = false;
    }

    if (!tagname.trim()) {
      newErrors.tagname = 'tagname is required';
      isValid = false;
    }

    if (!icon) {
      newErrors.icon = 'icon is required';
      isValid = false;
    }

    if (!logo) {
      newErrors.logo = 'logo is required';
      isValid = false;
    }
  
    // Update state with errors
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const Data = new FormData();
      Data.append('sitename', sitename);
      Data.append('appurl', appurl);
      Data.append('tagName', tagname);
      Data.append('icon', icon);
      Data.append('logo', logo);

      const response = await axios.post(`${API_URL}/api/v2/SiteSetting`, Data, {
        headers: {
          Authorization : token,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setId(response.data.id);
      setButtonText('EDIT');
      setsitenamePlaceholder(response.data.sitename);
      setappurlPlaceholder(response.data.appurl);
      settagnamePlaceholder(response.data.tagName);
      setIconUrl(`${API_URL}/uploads/${response.data.icon}`);
      setLogoUrl(`${API_URL}/uploads/${response.data.logo}`);

      console.log("Added successfully");

      Swal.fire({
        title: 'Success!',
        text: 'Added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error uploading:', error);

      Swal.fire({
        title: 'Error!',
        text: 'There was an error adding settings.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleSub = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updatedData = new FormData();
      updatedData.append('sitename', sitename);
      updatedData.append('appurl', appurl);
      updatedData.append('tagName', tagname);
      updatedData.append('icon', icon);
      updatedData.append('logo', logo);

      const response = await axios.patch(`${API_URL}/api/v2/editsettings/${id}`, updatedData, {
        headers: {
          Authorization : token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Updated successfully');
        Swal.fire({
          title: 'Success!',
          text: 'Successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setIconUrl(`${API_URL}/uploads/${response.data.icon}`);
        setLogoUrl(`${API_URL}/uploads/${response.data.logo}`);
      } else {
        console.log('Error updating settings');
        Swal.fire({
          title: 'Error!',
          text: 'There was an error updating the settings.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log('Error updating settings:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the settings.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleFormSubmit = (e) => {
    if (buttonText === 'ADD') {
      handleSubmit(e);
    } else if (buttonText === 'EDIT') {
      handleSub(e);
    }
  };

  const changeIconHandler = (e) => {
    const file = e.target.files[0];
    seticon(file);
    setIconUrl(URL.createObjectURL(file));
  };

  const changeLogoHandler = (e) => {
    const file = e.target.files[0];
    setlogo(file);
    setLogoUrl(URL.createObjectURL(file));
  };

  return (
    <div className='container2 mt-20'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/admin/Setting">Settings</Link>
          </li>
          <li className="breadcrumb-item active  text-white">Site Settings</li>
        </ol>
        <div className="card md-8" style={{ margin: '0px', maxWidth: '91rem', padding: '0px' }}>
          <div className="container card-body">
            <div className="temp">
              <div className="col col-lg-2">
                <Setting_sidebar />
              </div>
              <div className="col col-lg-9">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};
export default SiteSetting;
