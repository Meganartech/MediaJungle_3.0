import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import API_URL from '../Config';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";


const PlanDescription = () => {
  const id=localStorage.getItem('items');
  const planid = id;

  const [description,setdescription] = useState('')
  // const [planid,setplanid] = useState(planId);
  const [getall,setgetall] = useState('');
  console.log(planid)


  const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/v2/GetPlanById/${planid}`);
          setgetall(response.data);
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      const planDescription = {
        description: description,
        planId: planid,
      };
      console.log(planDescription)
      for (const key in planDescription) {
        formData.append(key, planDescription[key]);
      }
      const response = await axios.post(`${API_URL}/api/v2/AddPlanDescription`, planDescription,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      console.log("plandescription updated successfully");
      setdescription('')
      fetchData();
      // Handle success, e.g., show a success message to the user
    } catch (error) {
      console.error('Error uploading plandescription:', error);
      // Handle error, e.g., show an error message to the user
    }
    
   }

   const handleSetActive = async (descId, active) => {
    try {
      const response = await axios.post(`${API_URL}/api/v2/active/${descId}?active=${active}`);
      console.log(response.data);
      console.log(`Plan description ${descId} set to active=${active}`);
      fetchData();
    } catch (error) {
      console.error(`Error setting plan description ${descId} active=${active}:`, error);
    }
  };



  return (
  

    <div className="container-fluid">
      <div className="container2">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">{getall.planname} description</li>
        </ol>

        <div className="row">
            {/* Left side with the form */}
            <div className="col-lg-6">
              <div className="card-body">
                <form className="form-container" onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="temp">
                      <div className="col-lg-12">
                        <label htmlFor="planname">Plan Description</label>
                        <input
                          type="text"
                          name="planname"
                          id="planname"
                          className="form-control"
                          // value={planname}
                          Style={{width:"100px"}}
                          onChange={(e) => setdescription(e.target.value)}
                          required
                        />
                      </div>
                      <div className='col-lg-12'>
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-info">
                        ADD
                      </button>
                    </div>
                    </div>
                  </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Separator line */}
            <div className="col-lg-1 d-flex align-items-center justify-content-center">
              <div style={{ height: "100%", width: "1px", backgroundColor: "skyblue" }}></div>
            </div>

            {/* Right side with "Hello" */}
            <div className="col-lg-5 d-flex flex-column align-items-center justify-content-center">
              {getall.descriptions && getall.descriptions.length > 0 ? (
                getall.descriptions.map((desc, index) => (
                  <div key={index} className="w-100 mb-2 d-flex align-items-center">
                    <button style={{width:"500px"}} >
                    {desc.active === 'yes' && <span>&#10003;</span>} {/* Checkmark displayed if active is 'yes' */}
                      {desc.active === 'no' && <span>&#10007;</span>} {/* Wrong mark displayed if active is 'no' */}
                      {desc.description}
                    </button>
                    <button className="btn btn-info" style={{ margin: "3px 0 0 0" }} onClick={() => handleSetActive(desc.id, 'yes')}>
                      Active
                    </button>
                    <button className="btn btn-info" style={{ margin: "3px 0 0 3px" }} onClick={() => handleSetActive(desc.id, 'no')}>
                      Inactive
                    </button>
                    
                  </div>
                ))
              ) : (
                <div>No descriptions available</div>
              )}
            </div>
          </div>
        </div>
      </div>
  


  )
}

export default PlanDescription