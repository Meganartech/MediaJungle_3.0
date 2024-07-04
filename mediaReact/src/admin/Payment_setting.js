import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import "../css/Sidebar.css";
import API_URL from '../Config';
import Swal from 'sweetalert2'

const Payment_setting = () => {
  const [razorpay_key, setRazorpayKey] = useState('');
  const [razorpay_secret_key, setRazorpaySecretKey] = useState('');
  const [buttonText, setButtonText] = useState('ADD');
  const [keyPlaceholder, setKeyPlaceholder] = useState('Razorpay Key');
  const [secretKeyPlaceholder, setSecretKeyPlaceholder] = useState('Razorpay Secret Key');
  const [getall, setGetAll] = useState([]);
  const [id, setId] = useState('');
  const [error,setErrors] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v2/getrazorpay`)
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
          setKeyPlaceholder(data[0].razorpay_key);
          setSecretKeyPlaceholder(data[0].razorpay_secret_key);
          setId(data[0].id);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    // Validate razorpay_key
    if (!razorpay_key.trim()) {
      newErrors.razorpay_key = 'Razorpay Key is required';
      isValid = false;
    }
    // Validate razorpay_secret_key
    if (!razorpay_secret_key.trim()) {
      newErrors.razorpay_secret_key = 'Razorpay Secret Key is required';
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
      const razerpayData = {
        razorpay_key: razorpay_key,
        razorpay_secret_key: razorpay_secret_key,
      };
  
      const response = await axios.post(`${API_URL}/api/v2/AddrazorpayId`, razerpayData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data);
      setId(response.data.id);
      setButtonText('EDIT');
      setKeyPlaceholder(response.data.razorpay_key);
      setSecretKeyPlaceholder(response.data.razorpay_secret_key);
  
      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Razorpay settings added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error uploading:', error);
  
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: 'There was an error adding Razorpay settings.',
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
        razorpay_key: razorpay_key,
        razorpay_secret_key: razorpay_secret_key,
      };

      const response = await axios.patch(`${API_URL}/api/v2/Editrazorpay/${id}`, updatedData, {
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
        console.log('Error updating razorpay');
        Swal.fire({
          title: 'Error!',
          text: 'There was an error updating the razorpay.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log('Error updating razorpay:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the razorpay.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const changeRazorpayKeyHandler = (e) => {
    setRazorpayKey(e.target.value);
  };

  const changeRazorpaySecretKeyHandler = (e) => {
    setRazorpaySecretKey(e.target.value);
  };

  const handleFormSubmit = (e) => {
    if (buttonText === 'ADD') {
      handleSubmit(e);
    } else if (buttonText === 'EDIT') {
      handleSub(e);
    }
  };

  return (
   
      <div className="container-fluid">
        <div className='container2'>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item text-white">
              <Link to="/Dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Payment Settings</li>
          </ol>
          <div className="card md-8" style={{ maxWidth: '120rem', paddingLeft: '0px', height: '48rem' }}>
            <div className="container card-body" style={{ marginTop: '10px' }}>
              <div className="temp">
                <div className="col col-lg-2">
                  <Setting_sidebar />
                </div>
                <div className="col col-lg-9">
                  <ul className='breadcrumb-item' style={{ paddingLeft: '0px' }}>
                    <form onSubmit={handleFormSubmit} method="post" className="registration-form" style={{ height: '44rem' }}>
                      <div className="temp">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="custom-label" style={{ color: 'black' }}>
                              Razorpay Settings
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="custom-label">
                              Razorpay Key
                            </label>
                            <input
                              type="text"
                              placeholder={keyPlaceholder}
                              name="Razorpay Key"
                              value={razorpay_key}
                              onChange={changeRazorpayKeyHandler}
                            />
                            {error.razorpay_key && <div className="error-message error">{error.razorpay_key}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="custom-label">
                              Razorpay Secret Key
                            </label>
                            <input
                              type="text"
                              placeholder={secretKeyPlaceholder}
                              name="Razorpay Secret Key"
                              value={razorpay_secret_key}
                              onChange={changeRazorpaySecretKeyHandler}
                            />
                            {error.razorpay_secret_key && <div className="error-message error">{error.razorpay_secret_key}</div>}
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

export default Payment_setting;







{/* <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            PayPal Settings
                          </label>
                        </div>
                      </div>  */}
                      {/* <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Paypal Id
                          </label>
                          <input type="text" placeholder="Paypal Id" name="Paypal Id" value={Paypal_Id} onChange={changePaypal_IdHandler} />
                        </div>
                      </div> */}
                      {/* <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Paypal Secret
                          </label>
                          <input type="text" placeholder="Paypal Secret" name="Paypal Secret" value={Paypal_Secret} onChange={changePaypal_SecretHandler} />
                        </div>
                      </div> */}
                      {/* <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            Stripe Settings
                          </label>
                        </div>
                      </div> */}
                      {/* <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Stripe Publishable Key
                          </label>
                          <input type="text" placeholder="Stripe Publishable Key" name="Stripe Publishable Key" value={Stripe_Publishable_Key} onChange={changeStripe_Publishable_KeyHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Stripe Secret Key
                          </label>
                          <input type="text" placeholder="Stripe Secret Key" name="Stripe Secret Key" value={Stripe_Secret_Key} onChange={changeStripe_Secret_KeyHandler} />
                        </div>
                      </div> */}
                      {/* <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            Paystack Settings
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Paystack Key
                          </label>
                          <input type="text" placeholder="Paystack Key" name="Paystack Key" value={Paystack_Key} onChange={changePaystack_KeyHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Paystack Secret Key
                           </label>
                           <input type="text" placeholder="Paystack Secret Key" name="Paystack Secret Key" value={Paystack_Secret_Key} onChange={changePaystack_Secret_KeyHandler} />
                         </div>
                      </div> */}
                      {/* <div className="col-md-12">
                      {valid?
                          <div className="form-group">
                          <input type="submit" className="btn btn-info" name="submit" value="Submit" onClick={save} />
                         
                        </div>
                         :<div></div>
                        }
                      </div> */}

                      // useEffect(() => {
                      //   data==="false"?setValid(false):setValid(true)
                      // }, []);
                      //   //===========================================API--G================================================================
                      //   const [Paypal_Id, setPaypal_Id] = useState('');
                      //   const changePaypal_IdHandler = (event) => {
                      //     const newValue = event.target.value;
                      //     setPaypal_Id(newValue); // Updating the state using the setter function from useState
                      //   };
                      //   const [Paypal_Secret, setPaypal_Secret] = useState('');
                      //   const changePaypal_SecretHandler = (event) => {
                      //     const newValue = event.target.value;
                      //     setPaypal_Secret(newValue); // Updating the state using the setter function from useState
                      //   };
                      //   const [Stripe_Publishable_Key, setStripe_Publishable_Key] = useState('');
                      //   const changeStripe_Publishable_KeyHandler = (event) => {
                      //     const newValue = event.target.value;
                      //     setStripe_Publishable_Key(newValue); // Updating the state using the setter function from useState
                      //   };
                      //   const [Stripe_Secret_Key, setStripe_Secret_Key] = useState('');
                      //   const changeStripe_Secret_KeyHandler = (event) => {
                      //     const newValue = event.target.value;
                      //     setStripe_Secret_Key(newValue); // Updating the state using the setter function from useState
                      //   };
                      //   const [Razorpay_Key, setRazorpay_Key] = useState('');
                      //   const changeRazorpay_KeyHandler = (event) => {
                      //     const newValue = event.target.value;
                      //     setRazorpay_Key(newValue); // Updating the state using the setter function from useState
                      //   };
                      //   const [Razorpay_Secret_Key, setRazorpay_Secret_Key] = useState('');
                      //   const changeRazorpay_Secret_KeyHandler = (event) => {
                      //     const newValue = event.target.value;
                      //     setRazorpay_Secret_Key(newValue); // Updating the state using the setter function from useState
                      //   };
                      //   const [Paystack_Key, setPaystack_Key] = useState('');
                      //     const changePaystack_KeyHandler = (event) => {
                      //       const newValue = event.target.value;
                      //       setPaystack_Key(newValue); // Updating the state using the setter function from useState
                      //   };
                      //   const [Paystack_Secret_Key, setPaystack_Secret_Key] = useState('');
                      //     const changePaystack_Secret_KeyHandler = (event) => {
                      //       const newValue = event.target.value;
                      //       setPaystack_Secret_Key(newValue); // Updating the state using the setter function from useState
                      //   };
                      
