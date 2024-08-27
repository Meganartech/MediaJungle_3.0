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
  const [validity, setvalidity] = useState('');
  const [getall, setgetall] = useState();
  const [descriptions, setdescriptions] = useState([]);
  const [planid, setplanid] = useState('');
  const [plan, setplan] = useState('');
  const navigate = useNavigate();
  const token = sessionStorage.getItem("tokenn");

  useEffect(() => {
    const fetchdescriptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v2/GetAllDescriptions`);
        setdescriptions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching descriptions:', error);
      }
    };

    fetchdescriptions();
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
  const handleSetActive = async (descriptionId, active) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v2/active/${descriptionId}?active=${active}`,
        null,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const updateddescriptions = descriptions.map((description) => {
        if (description.id === descriptionId) {
          return { ...description, active: active };
        }
        return description;
      });

      setdescriptions(updateddescriptions);
    } catch (error) {
      console.error(`Error setting description ${descriptionId} active=${active}:`, error);
    }
  };

  const handleDeletedescription = async (descId) => {
    try {
      await axios.delete(`${API_URL}/api/v2/deletedesc/${descId}`, {
        headers: {
          Authorization: token,
        },
      });
  
      // Update state to remove the deleted description
      setdescriptions((prevDescriptions) =>
        prevDescriptions.filter((description) => description.id !== descId)
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Description deleted successfully',
      });
    } catch (error) {
      console.error(`Error deleting plan description ${descId}:`, error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete description. Please try again later.',
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
        } else if (result.isDismissed) {
          console.log('Cancel was clicked');
        }
      });
      return;
    }

    try {
      const formData = new FormData();
      const planData = {
        planname: planname,
        amount: amount,
        validity: validity,
      };

      for (const key in planData) {
        formData.append(key, planData[key]);
      }

      const response = await axios.post(`${API_URL}/api/v2/PlanDetails`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setplanid(response.data.id);
      setplan(response.data.planname);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Plan details uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading plan details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to upload plan details. Please try again later.',
      });
    }

    setplanname('');
    setamount('');
    setvalidity('');
  };

  const handleAddFeatures = () => {
    navigate('/admin/PlanDescription');
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
                <label htmlFor="amount">Amount</label>
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
                <label htmlFor="validity">Validity</label>
                <input
                  type="text"
                  name="validity"
                  id="validity"
                  className="form-control"
                  value={validity}
                  onChange={(e) => setvalidity(e.target.value)}
                  required
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
                    {descriptions && descriptions.length > 0 ? (
                      descriptions.map((description, index) => (
                        <div key={index} className="mb-2 d-flex align-items-center">
                          <button className="flex-grow-1" style={{ textAlign: "left" }}>
                            {description.active === 'yes' && <span>&#10003;</span>}
                            {description.active === 'no' && <span>&#10007;</span>}
                            {description.description}
                          </button>
                          <button className="btn btn-info ms-2" onClick={() => handleSetActive(description.id, 'yes')}>
                            Active
                          </button>
                          <button className="btn btn-info ms-2" onClick={() => handleSetActive(description.id, 'no')}>
                            Inactive
                          </button>
                          <button className="btn btn-danger ms-2 " onClick={() => handleDeletedescription(description.id)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div>No descriptions available</div>
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
