import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';

const Editplan = () => {
    const id = localStorage.getItem('items');
    const [updatedplan , setupdatedplan] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/v2/GetPlanById/${id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setupdatedplan(data);
            console.log(data)
          })
          .catch(error => {
            console.error('Error fetching plan:', error);
          });
      }, [id]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setupdatedplan(prevPlan => ({
          ...prevPlan,
          [name]: value,
        }));
      };



      const handleSubmit = (e) => {
        e.preventDefault();
        const planId = id; // Assuming id is defined elsewhere
        fetch(`${API_URL}/api/v2/editPlans/${planId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedplan),
        })
        .then((response) => {
          if (response.ok) {
            console.log('Plan updated successfully');
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Plan details successfully updated',
            });
          } else {
            console.log('Error updating plan');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error updating plan',
            });
          }
        })
        .catch((error) => {
          console.log('Error updating plan:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating the plan',
          });
        });
      };
      
  return (
   
      <div className="container-fluid">
        <h1 className="mt-4 text-white">{updatedplan.planname}'s Profile</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Edit</li>
        </ol>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Planname</th>
                        <td>
                          <input
                            type="text"
                            name="planname"
                            value={updatedplan.planname}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Amount</th>
                        <td>
                            <input
                              type="number"
                              name="amount"
                              value={updatedplan.amount}
                              onChange={handleChange}
                              className="form-control"
                            />
                        </td>
                      </tr>
                      <tr>
                        <th>Validity</th>
                            <td>
                                <input
                                type="text"
                                name='validity'
                                value={updatedplan.validity}
                                onChange={handleChange}
                                className='form-control'
                                />
                            </td>
                        
                      </tr>
                    </tbody>
                  </table>
                  <button type="submit" className="btn btn-info">
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
 
  )
}

export default Editplan