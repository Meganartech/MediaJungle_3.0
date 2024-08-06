import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';

const AddTenure = () => {
    const [tenurename, setTenurename] = useState('');
    const [amount, setAmount] = useState('');
    const [validity, setValidity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const token = sessionStorage.getItem("tokenn");
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const data = {
          tenure_name: tenurename,
          amount: amount,
          validity: validity
      };
  
      console.log('Submitting data:', data); // Log the data being sent
  
      fetch(`${API_URL}/api/v2/addtenure`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`, // Ensure the token is passed correctly
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
      .then(response => {
          console.log('Response Status:', response.status); // Log response status
          return response.json(); // Parse JSON response
      })
      .then(responseData => {
          console.log('Response Data:', responseData); // Log the response data
          // Check if the response has an 'id' indicating success
          if (responseData.id) {
              // Clear the form fields
              setTenurename('');
              setAmount('');
              setValidity('');
  
              Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Tenure inserted successfully!',
              });
          } else {
              setErrorMessage(responseData.message || 'Error occurred while inserting tenure.');
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: responseData.message || 'Error occurred while inserting tenure.',
              });
          }
      })
      .catch(error => {
          setErrorMessage('Error occurred while inserting tenure.');
          console.error('Error:', error); // Log the error
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while inserting the tenure.',
          });
      });
  };
  
  
    return (
        <div className="container-fluid con-flu">
            <div className="container2">
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item">
                        <Link to="/admin/TenureList">Tenures</Link>
                    </li>
                    <li className="breadcrumb-item active text-white">Add Tenure</li>
                </ol>

                <div className='card-body'>
                    <form className='form-container' onSubmit={handleSubmit}>
                        <div className='modal-body'>
                            <div className='temp'>
                                <div className='col-lg-6'>
                                    <label htmlFor="tenurename">Tenure Name</label>
                                    <input
                                        type="text"
                                        name="tenurename"
                                        id="tenurename"
                                        className="form-control"
                                        value={tenurename}
                                        onChange={(e) => setTenurename(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <label htmlFor="amount">Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        className="form-control"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='col-lg-6'>
                                    <label htmlFor="validity">Validity</label>
                                    <input
                                        type="text"
                                        name="validity"
                                        id="validity"
                                        className="form-control"
                                        value={validity}
                                        onChange={(e) => setValidity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className='col-lg-12'>
                                    <div className="d-flex justify-content-center" style={{marginTop:"10px"}}> 
                                        <button
                                            type="submit"
                                            className='text-center btn btn-info'
                                        >
                                            SAVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTenure;
