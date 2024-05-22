import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import '../App.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import axios from 'axios';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";

const Payment_setting = () => {


  // ---------------------Admin functions -------------------------------
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [users, setUsers] = useState([]);
  const name = sessionStorage.getItem('username');
  const data=sessionStorage.getItem("type");
  const [valid, setValid] = useState(true);

  useEffect(() => {
  data==="false"?setValid(false):setValid(true)
}, []);
  //===========================================API--G================================================================
  const [Paypal_Id, setPaypal_Id] = useState('');
  const changePaypal_IdHandler = (event) => {
    const newValue = event.target.value;
    setPaypal_Id(newValue); // Updating the state using the setter function from useState
  };
  const [Paypal_Secret, setPaypal_Secret] = useState('');
  const changePaypal_SecretHandler = (event) => {
    const newValue = event.target.value;
    setPaypal_Secret(newValue); // Updating the state using the setter function from useState
  };
  const [Stripe_Publishable_Key, setStripe_Publishable_Key] = useState('');
  const changeStripe_Publishable_KeyHandler = (event) => {
    const newValue = event.target.value;
    setStripe_Publishable_Key(newValue); // Updating the state using the setter function from useState
  };
  const [Stripe_Secret_Key, setStripe_Secret_Key] = useState('');
  const changeStripe_Secret_KeyHandler = (event) => {
    const newValue = event.target.value;
    setStripe_Secret_Key(newValue); // Updating the state using the setter function from useState
  };
  const [Razorpay_Key, setRazorpay_Key] = useState('');
  const changeRazorpay_KeyHandler = (event) => {
    const newValue = event.target.value;
    setRazorpay_Key(newValue); // Updating the state using the setter function from useState
  };
  const [Razorpay_Secret_Key, setRazorpay_Secret_Key] = useState('');
  const changeRazorpay_Secret_KeyHandler = (event) => {
    const newValue = event.target.value;
    setRazorpay_Secret_Key(newValue); // Updating the state using the setter function from useState
  };
  const [Paystack_Key, setPaystack_Key] = useState('');
    const changePaystack_KeyHandler = (event) => {
      const newValue = event.target.value;
      setPaystack_Key(newValue); // Updating the state using the setter function from useState
  };
  const [Paystack_Secret_Key, setPaystack_Secret_Key] = useState('');
    const changePaystack_Secret_KeyHandler = (event) => {
      const newValue = event.target.value;
      setPaystack_Secret_Key(newValue); // Updating the state using the setter function from useState
  };
  const save = (e) => {
    e.preventDefault();
    let SiteSetting = { paypal_id: Paypal_Id, paypal_secret: Paypal_Secret,stripe_publishable_key: Stripe_Publishable_Key, stripe_secret_key: Stripe_Secret_Key,razorpay_key: Razorpay_Key, razorpay_secret_key: Razorpay_Secret_Key,paystack_key: Paystack_Key, paystack_secret_key: Paystack_Secret_Key  };
    console.log("'employee =>'+JSON.stringify(SiteSetting)");
    Employee.setPaymentsettings(SiteSetting).then(res => {
      setPaypal_Id('');
      setPaypal_Secret('');
      setStripe_Publishable_Key('');
      setStripe_Secret_Key('');
      setRazorpay_Key('');
      setRazorpay_Secret_Key('');
      setPaystack_Key('');
      setPaystack_Secret_Key('');
    })
  }

  return (

    <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem", height: '55rem' }}>

        <Sidebar />
      <div className="container-fluid"   >
        <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Payment Settings</li>
        </ol>
        <div className="card md-8" style={{ maxWidth: '120rem', paddingLeft: '0px', height: '48rem' }}>
          <div className="container card-body" style={{ marginTop: '10px' }}>
            <div class="temp">
              <div class="col col-lg-2">
                <Setting_sidebar />
              </div>
              <div class="col col-lg-9">
                <ul className='breadcrumb-item' style={{ paddingLeft: '0px' }}>
                  <form onSubmit="" method="post" className="registration-form" style={{ height: '44rem' }}>
                    <div className="temp">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            PayPal Settings
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Paypal Id
                          </label>
                          <input type="text" placeholder="Paypal Id" name="Paypal Id" value={Paypal_Id} onChange={changePaypal_IdHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Paypal Secret
                          </label>
                          <input type="text" placeholder="Paypal Secret" name="Paypal Secret" value={Paypal_Secret} onChange={changePaypal_SecretHandler} />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            Stripe Settings
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
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
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="custom-label" style={{color:'black'}}>
                            Razorpay Settings
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Razorpay Key
                          </label>
                          <input type="text" placeholder="Razorpay Key" name="Razorpay Key" value={Razorpay_Key} onChange={changeRazorpay_KeyHandler} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="custom-label">
                            Razorpay Secret Key
                          </label>
                          <input type="text" placeholder="Razorpay Secret Key" name="Razorpay Secret Key" value={Razorpay_Secret_Key} onChange={changeRazorpay_Secret_KeyHandler} />
                        </div>
                      </div>
                      <div className="col-md-12">
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
                      </div>
                      <div className="col-md-12">
                      {valid?
                          <div className="form-group">
                          <input type="submit" className="btn btn-info" name="submit" value="Submit" onClick={save} />
                         
                        </div>
                         :<div></div>
                        }
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

export default Payment_setting;
