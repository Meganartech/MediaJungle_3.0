import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import API_URL from '../Config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";

const PlanDetailsList = () => {

    const [getall,setgetall] = useState('');
    const navigate = useNavigate();

  

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllPlans`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setgetall(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDelete = (planId) => {
    fetch(`${API_URL}/api/v2/DeletePlan/${planId}`,{
      method:'DELETE',
    })
    .then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.status <= 205 ? {} : response.json();
})
.then(data => {
  if (data) {
    console.log('plan deleted successfully', data);
  } else {
    console.log('plan deleted successfully (no content)');
  }
  setgetall(prevPlan => prevPlan.filter(plan => plan.id !== planId));
})

    .catch(error => {
      console.error('Error deleting plan:', error);
    });
  };

  const handlEdit = async (planId) => {
    localStorage.setItem('items', planId);
    navigate('/admin/Editplan');
  };

  const handlAddDescription = async (planId) => {
            localStorage.setItem('items', planId);
            navigate('/admin/PlanDescription');
  };



  return (
    
      <div className="container-fluid">
   
     <div className='container2'>
        <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
        </li>
          <li className="breadcrumb-item active">List Plans</li>
        </ol>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            
              <div className="card-1 mb-4" style={{ height: "auto" }}>
                <div className="card-header">
                  <i className="fas fa-table me-1"></i>
                  Plan List
                </div>
                <div className="card-body profile-card-body">
                  <table id="datatablesSimple">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Plan name</th>
                        <th>Amount</th>
                        <th>Validity</th>
                        <th>Action</th>
                        <th>Add Description</th>
                      </tr>
                    </thead>
                    <tbody>
                    {getall && getall.length > 0 && (
                      getall.map((plan, index) => (
                        <tr key={plan.id}>
                          <td>{index + 1}</td>
                          <td>{plan.planname}</td>
                          <td>{plan.amount}</td>
                          <td>{plan.validity}</td>
                          <td> <button onClick={() => handlEdit(plan.id)}>
                              <i className="fas fa-edit" aria-hidden="true"></i>
                            </button>
              
                            <button onClick={() => handleDelete(plan.id)}>
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </button></td>
                          <td>
                            <button  onClick={() => handlAddDescription(plan.id)} className="btn btn-secondary ml-2" >
                                Add
                            </button>
                          </td>
                          </tr>
                      )))}
                    </tbody>
                </table>
     </div>

    </div>
    </div>   
    </div>
    </div>

  )
}

export default PlanDetailsList