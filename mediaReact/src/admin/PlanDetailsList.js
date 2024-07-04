import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
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
    // Display confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this plan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, proceed with fetch DELETE request
        fetch(`${API_URL}/api/v2/DeletePlan/${planId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.status <= 204 ? null : response.json();
        })
        .then(data => {
          if (!data) {
            console.log('Plan deleted successfully');
            // Remove the deleted plan from the local state
            setgetall(prevPlan => prevPlan.filter(plan => plan.id !== planId));
            Swal.fire(
              'Deleted!',
              'Your plan has been deleted.',
              'success'
            );
          } else {
            console.error('Error deleting plan:', data.error); // Log error message from server
            Swal.fire(
              'Error!',
              'Failed to delete plan. Please try again later.',
              'error'
            );
          }
        })
        .catch(error => {
          console.error('Error deleting plan:', error);
          Swal.fire(
            'Error!',
            'Failed to delete plan. Please try again later.',
            'error'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('Delete operation cancelled');
      }
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