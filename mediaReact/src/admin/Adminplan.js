import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import API_URL from '../Config';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import Swal from 'sweetalert2';

const Adminplan = () => {
  const [planname, setplanname] = useState('');
  const [amount, setamount] = useState('');
  const [validity, setvalidity] = useState('1');
  const [getall, setgetall] = useState();
  const [features, setfeatures] = useState([]);
  const [planid, setplanid] = useState('');
  const [plan, setplan] = useState('');
  const navigate = useNavigate();
  const token = sessionStorage.getItem("tokenn");

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v2/GetAllFeatures`);
  
        // Ensure all features have 'active' set to null initially if not provided
        const updatedFeatures = response.data.map((feature) => ({
          ...feature,
          active: feature.active === undefined || feature.active === null ? null : feature.active,
        }));
  
        setfeatures(updatedFeatures);
      } catch (error) {
        console.error('Error fetching features:', error);
      }
    };
  
    fetchFeatures();
  }, []);
  

  useEffect(() => {
    fetch(`${API_URL}/api/v2/getrazorpay`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setgetall(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const hasPaymentPlan = () => {
    return getall && getall.length > 0;
  };

 
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/api/v2/GetPlanById/${planid}`);
  //     setgetall(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  const handleSetActive = async (featureId, active) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/v2/set-active/${featureId}?active=${active}`,
        null,
        {
          headers: {
            Authorization: token,
          },
          params: {
            active: active, // Pass boolean directly
          },
        }
      );
      
      // Log to check API response
      console.log("Request Data:", {
        featureId: featureId,
        active: active,
        token: token,
      });
      
      // Update feature state locally
      const updatedfeatures = features.map((feature) => {
        if (feature.id === featureId) {
          return { ...feature, active: active }; // Use boolean values
        }
        return feature;
      });
  
      setfeatures(updatedfeatures);
    } catch (error) {
      console.error(`Error setting feature ${featureId} active=${active}:`, error);
    }
  };
  

  const handleDeletefeature = async (descId) => {
    try {
      await axios.delete(`${API_URL}/api/v2/deletedesc/${descId}`, {
        headers: {
          Authorization: token,
        },
      });
  
      // Update state to remove the deleted feature
      setfeatures((prevFeatures) =>
        prevFeatures.filter((feature) => feature.id !== descId)
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Feature deleted successfully',
      });
    } catch (error) {
      console.error(`Error deleting plan feature ${descId}:`, error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete feature. Please try again later.',
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!hasPaymentPlan()) {
      Swal.fire({
        title: 'Error!',
        text: 'You first need to add a key and secret key to enable this option.',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Go to Payment setting page',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/admin/Payment_setting');
        }
      });
      return;
    }
  
    try {
      // Prepare form data
      const formData = new FormData();
      const planData = {
        planname: planname,
        amount: amount,
        validity: validity,
      };
  
      for (const key in planData) {
        formData.append(key, planData[key]);
      }
  
      console.log("Sending data:", planData);
  
      // Send request to save plan details
      const response = await axios.post(`${API_URL}/api/v2/PlanDetails`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log("Response data:", response.data);
  
      const planId = response.data.planId;
  
      // Prepare features data with planId and descriptionId
      const selectedFeatures = features.filter(feature => feature.active !== null); // Only save features that are marked active/inactive
  
      const featuresData = selectedFeatures.map(feature => ({
        planId: planId,
        descriptionId: feature.id, // Assuming the feature's ID is the description ID
        active: feature.active === 'yes' ? true : false, // Convert to boolean for saving
      }));
  
      console.log("Features data:", featuresData);
  
      // Save features with the planId and descriptionId
      await axios.post(`${API_URL}/api/v2/SaveFeatures`, featuresData, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Plan details and features updated successfully',
      });
  
      // Clear the form
      setplanname('');
      setamount('');
      setvalidity('1');
  
    } catch (error) {
      console.error('Error uploading plan details:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to upload plan details. Please try again later.',
      });
    }
  };
  
  const handleAddFeatures = () => {
    navigate('/admin/PlanFeatures');
  };

  return (
    <div className='container3 mt-20'>
      <ol className="breadcrumb mb-4 d-flex my-0">
        <li className="breadcrumb-item">
          <Link to="/admin/PlanDetailsList">Plans</Link>
        </li>
        <li className="breadcrumb-item active text-white">Add Plan</li>
      </ol>

      <div className='card-body'>
        <div className='modal-body'>
          <div className='temp'>
            <div className='col-lg-5'>
              <div className='col-lg-12'>
                <label htmlFor="planname">Plan Name</label>
                <input
                  type="text"
                  name="planname"
                  id="planname"
                  className="form-control"
                  value={planname}
                  onChange={(e) => setplanname(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="amount">Amount  (per Month)</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setamount(e.target.value)}
                  required
                />
                <br />
              </div>
              <div className='col-lg-12'>
  <input
    type="hidden"
    name="validity"
    id="validity"
    className="form-control"
    value={validity}
    onChange={(e) => setvalidity(e.target.value)}
  />
</div>

            </div>
            <div className="col-lg-2 d-flex align-items-center justify-content-center">
              <div style={{ height: "100%", width: "1px", backgroundColor: "skyblue" }}></div>
            </div>

            <div className="col-lg-5 position-relative" style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              bottom: '-30px'
            }}>
              <div className="col-lg-6 w-100 d-flex flex-column align-items-center justify-content-center">
                <div className="w-100 d-flex">
                  <div className="w-100">
                  {features && features.length > 0 ? (
  features.map((feature, index) => (
    <div key={index} className="mb-2 d-flex align-items-center">
      <button className="flex-grow-1" style={{ textAlign: "left" }}>
        {/* Only show tick or cross mark after clicking Active or Inactive */}
        {feature.active === 'yes' && <span>&#10003;</span>}
        {feature.active === 'no' && <span>&#10007;</span>}
        {feature.features}
      </button>
      <button className="btn btn-info ms-2" onClick={() => handleSetActive(feature.id, 'yes')}>
        Active
      </button>
      <button className="btn btn-info ms-2" onClick={() => handleSetActive(feature.id, 'no')}>
        Inactive
      </button>
      {/* <button className="btn btn-danger ms-2" onClick={() => handleDeletefeature(feature.id)}>
        <i className="fa fa-trash" aria-hidden="true"></i>
      </button> */}
    </div>
  ))
) : (
  <div>No features available</div>
)}
                  </div>
                </div>
              </div>
              <div className="position-absolute" style={{ top: '-80px', right: '-10px' }}>
                <button className="btn btn-info" style={{ fontSize: '15px' }} onClick={handleAddFeatures}>Add Features</button>
              </div>
            </div>
          </div >
          <div className="d-flex justify-content-center" style={{marginTop:"10px"}}>
          <button className='text-center btn btn-info' onClick={handleSubmit}>
                    SAVE
                  </button></div>
        </div>
      </div>
    </div>
  );
};

export default Adminplan;
