import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';
import "../css/Sidebar.css";

const EditPlan = () => {
  const id = localStorage.getItem('items');
  const [plan, setPlan] = useState({
    planname: '',
    amount: '',
    validity: ''
  });
  const [features, setFeatures] = useState([]);
  const [featureStates, setFeatureStates] = useState([]);
  const token = sessionStorage.getItem("tokenn");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanAndFeatures = async () => {
      try {
        // Fetch plan details
        const planResponse = await axios.get(`${API_URL}/api/v2/GetPlanById/${id}`);
        setPlan(planResponse.data);
    
        // Fetch features
        const featuresResponse = await axios.get(`${API_URL}/api/v2/GetAllFeatures`);
        const updatedFeatures = featuresResponse.data.map((feature) => ({
          ...feature,
          active: feature.active === undefined || feature.active === null ? 'no' : feature.active
        }));
        console.log('Fetched features:', updatedFeatures);
        setFeatures(updatedFeatures);
    
        // Fetch existing feature states for the plan
        const featureStatesResponse = await axios.get(`${API_URL}/api/v2/GetFeaturesByPlanId?planId=${id}`);
        console.log('Fetched feature states:', featureStatesResponse.data);
        setFeatureStates(featureStatesResponse.data);
      } catch (error) {
        console.error('Error fetching plan or features:', error);
      }
    };
  
    fetchPlanAndFeatures();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prevPlan => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleSetActive = (featureId, active) => {
    // Update the state for featureStates
    const updatedFeatureStates = featureStates.map((feature) =>
      feature.featureId === featureId ? { ...feature, active } : feature
    );
    console.log('Updated featureStates:', updatedFeatureStates);
    setFeatureStates(updatedFeatureStates);
  
    // Update the state for features
    const updatedFeatures = features.map((feature) =>
      feature.id === featureId ? { ...feature, active } : feature
    );
    console.log('Updated features:', updatedFeatures);
    setFeatures(updatedFeatures);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Prepare plan data
      const planResponse = await axios.patch(`${API_URL}/api/v2/editPlans/${id}`, plan, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
  
      // Collect feature data
      const featuresData = featureStates.map(feature => ({
        planId: id,
        featureId: feature.featureId,
        active: feature.active === 'yes', // Assuming 'yes' indicates active
      }));
      console.log("Features Data:", featuresData);
  
      // Send request to update features
      await axios.put(`${API_URL}/api/v2/planfeaturemerge`, featuresData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
  
      Swal.fire({ icon: 'success', title: 'Success', text: 'Plan details and features updated successfully' });
  
      navigate('/admin/PlanDetailsList');
    } catch (error) {
      console.error('Error updating plan details:', error.response ? error.response.data : error.message);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update plan details. Please try again later.' });
    }
  };
  

  return (
    <div className='container3 mt-20'>
      <ol className="breadcrumb mb-4 d-flex my-0">
        <li className="breadcrumb-item"><Link to="/admin/PlanDetailsList">Plans</Link></li>
        <li className="breadcrumb-item active text-white">Edit Plan</li>
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
                  value={plan.planname || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="amount">Amount (per Month)</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="form-control"
                  value={plan.amount || ''}
                  onChange={handleChange}
                  required
                />
                <br />
              </div>
              {/* <div className='col-lg-12'>
                <label htmlFor="validity">Validity</label>
                <input
                  type="text"
                  name="validity"
                  id="validity"
                  className="form-control"
                  value={plan.validity || ''}
                  onChange={handleChange}
                  required
                />
              </div> */}
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
                    {features.length > 0 ? (
                      features.map((feature, index) => (
                        <div key={index} className="mb-2 d-flex align-items-center">
                        <span style={{ width: '20px', textAlign: 'center' }}>
                          {feature.active === 'yes' && <span>&#10003;</span>}
                          {feature.active === 'no' && <span>&#10007;</span>}
                        </span>
                        <button className="flex-grow-1" style={{ textAlign: "left" }}>
                          {feature.features}
                        </button>
                        <button className="btn btn-info ms-2" onClick={() => handleSetActive(feature.id, 'yes')}>
                          Active
                        </button>
                        <button className="btn btn-info ms-2" onClick={() => handleSetActive(feature.id, 'no')}>
                          Inactive
                        </button>
                      </div>
                      
                      ))
                    ) : (
                      <div>No features available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center" style={{ marginTop: "10px" }}>
            <button className='text-center btn btn-info' onClick={handleSubmit}>UPDATE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlan;
