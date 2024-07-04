import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import API_URL from '../Config';
import Swal from 'sweetalert2';
import "../css/Sidebar.css";

const ContactSetting = () => {
  const [email, setEmail] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [copyright, setCopyright] = useState('');
  const [buttonText, setButtonText] = useState('ADD');
  const [emailPlaceholder, setEmailPlaceholder] = useState('contact_email');
  const [mobilePlaceholder, setMobilePlaceholder] = useState('contact_mobile');
  const [addressPlaceholder, setAddressPlaceholder] = useState('contact_address');
  const [copyrightPlaceholder, setCopyrightPlaceholder] = useState('copyright_content');
  const [id, setId] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    mobilenumber: '',
    address: '',
    copyright: '',
  });

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/GetcontactSettings`);
      if (response.data.length > 0) {
        setButtonText('EDIT');
        setEmailPlaceholder(response.data[0].contact_email);
        setMobilePlaceholder(response.data[0].contact_mobile);
        setAddressPlaceholder(response.data[0].contact_address);
        setCopyrightPlaceholder(response.data[0].copyright_content);
        setId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

     // Validate email
     if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    // Validate mobile number
    if (!mobilenumber.trim()) {
      newErrors.mobilenumber = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(mobilenumber)) {
      newErrors.mobilenumber= 'Invalid mobile number';
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!copyright.trim()) {
      newErrors.copyright = 'Copyright Content is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }


    try {
      const contactData = {
        contact_email: email,
        contact_mobile: mobilenumber,
        contact_address: address,
        copyright_content: copyright,
      };

      const response = await axios.post(`${API_URL}/api/v2/Contactsettings`, contactData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setId(response.data.id);
      setButtonText('EDIT');
      setEmailPlaceholder(response.data.contact_email);
      setMobilePlaceholder(response.data.contact_mobile);
      setAddressPlaceholder(response.data.contact_address);
      setCopyrightPlaceholder(response.data.copyright_content);

      Swal.fire({
        title: 'Success!',
        text: 'Contact settings added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding contact settings:', error);

      Swal.fire({
        title: 'Error!',
        text: 'There was an error adding contact settings.',
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
      const updatedData = {
        contact_email: email,
        contact_mobile: mobilenumber,
        contact_address: address,
        copyright_content: copyright,
      };

      const response = await axios.patch(`${API_URL}/api/v2/editcontactsetting/${id}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setButtonText('EDIT');
        Swal.fire({
          title: 'Success!',
          text: 'Contact settings updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error updating contact settings.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error updating contact settings:', error);

      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating contact settings.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };



  return (

    <div className="container-fluid">
      <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Contact Settings</li>
        </ol>
        <div className="card md-8" style={{ maxWidth: '91rem', paddingLeft: '0px' }}>
          <div className="container card-body">
            <div className="temp">
              <div className="col col-lg-2">
                <Setting_sidebar />
              </div>

              <div className="col col-lg-9">
                <ul className='breadcrumb-item' style={{ paddingLeft: '0px' }}>
                  <form onSubmit={buttonText === 'ADD' ? handleSubmit : handleSub} method="post" className="registration-form">
                    <div className="temp">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Contact Email
                          </label>
                          <input
                            type="text"
                            placeholder={emailPlaceholder}
                            name="contact_email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`form-control ${errors.email && 'is-invalid'}`}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Contact Mobile
                          </label>
                          <input
                            type="text"
                            placeholder={mobilePlaceholder}
                            name="contact_mobile"
                            value={mobilenumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className={`form-control ${errors.mobilenumber && 'is-invalid'}`}
                          />
                          {errors.mobilenumber && (
                            <div className="invalid-feedback">
                              {errors.mobilenumber}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Contact Address
                          </label>
                          <input
                            type="text"
                            placeholder={addressPlaceholder}
                            name="contact_address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`form-control ${errors.address && 'is-invalid'}`}
                          />
                          {errors.address && (
                            <div className="invalid-feedback">
                              {errors.address}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Copyright Content
                          </label>
                          <input
                            type="text"
                            placeholder={copyrightPlaceholder}
                            name="copyright_content"
                            value={copyright}
                            onChange={(e) => setCopyright(e.target.value)}
                            className={`form-control ${errors.copyright && 'is-invalid'}`}
                          />
                          {errors.copyright && (
                            <div className="invalid-feedback">
                              {errors.copyright}
                            </div>
                          )}
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

export default ContactSetting;
