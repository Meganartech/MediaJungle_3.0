import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import "../css/Sidebar.css";
import API_URL from '../Config';
import Swal from 'sweetalert2'
const Other_setting = () => {

  const [appstore ,setappstore] = useState('');
  const [playstore,setplaystore] = useState('');
  const [buttonText, setButtonText] = useState('ADD');
  const [AppStorelaceholder, setAppStorePlaceholder] = useState('App Store');
  const [PlayStorePlaceholder, setPlayStorePlaceholder] = useState('Play Store');
  const [getall, setGetAll] = useState([]);
  const [id, setId] = useState('');
  
  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetOthersettings`)
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
          setAppStorePlaceholder(data[0].appstore);
          setPlayStorePlaceholder(data[0].playstore);
          setId(data[0].id);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const Data = {
        playstore: playstore,
        appstore: appstore,
      };

      const response = await axios.post(`${API_URL}/api/v2/OtherSettings`, Data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setId(response.data.id);
      setButtonText('EDIT');
      setAppStorePlaceholder(response.data.appstore);
      setPlayStorePlaceholder(response.data.playstore);
      console.log("Added successfully");

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error uploading:', error);

      // Show error message
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

    try {
      const updatedData = {
        playstore: playstore,
        appstore: appstore,
      };

      const response = await axios.patch(`${API_URL}/api/v2/editothersettings/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('updated successfully');
        Swal.fire({
          title: 'Success!',
          text: 'successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
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
      console.log('Error updating razorpay:', error);
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

  const changeAppStoreHandler = (e) => {
    setappstore(e.target.value);
  };

  const changePlayStoreHandler = (e) => {
    setplaystore(e.target.value);
  };


  return (

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
        <form onSubmit={handleFormSubmit} method="post" className="registration-form" style={{ height: '44rem' }}>
        <div className="temp">

        <div className="col-md-6">
        <div className="form-group">
          <label className="custom-label">
              Appstore
          </label>
          <input 
            type="text" 
            placeholder={AppStorelaceholder} 
            name="appstore"
            value={appstore}
            onChange={changeAppStoreHandler}   
            />
        </div>
        </div>


        <div className="col-md-6">
        <div className="form-group">
          <label className="custom-label">
            Playstore
          </label>
          <input 
            type="text" 
            placeholder={PlayStorePlaceholder} 
            name="playstore"   
            value={playstore}
            onChange={changePlayStoreHandler}
            />
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
    </div>

  );
};

export default Other_setting;
