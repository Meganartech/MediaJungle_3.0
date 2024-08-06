import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';

const Edittenure = () => {
    const id = localStorage.getItem('items');
    const [updatedTenure, setupdatedTenure] = useState({
        tenure_name: '',
        amount: 0,
        validity: ''
    });
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetch(`${API_URL}/api/v2/tenures/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched tenure data:', data); // Log the data
                setupdatedTenure(data);
            })
            .catch(error => {
                console.error('Error fetching tenure:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setupdatedTenure(prevTenure => ({
            ...prevTenure,
            [name]: value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/api/v2/edittenure/${id}`, {
            method: 'PUT', // or PATCH, depending on your API
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTenure),
        })
        .then((response) => {
            console.log('Response status:', response.status); // Log the response status
            if (response.ok) { // Check if the response status is 200-299
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Tenure details successfully updated',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error updating tenure', // Generic error message
                });
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error); // Log the error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating the tenure',
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
                    <li className="breadcrumb-item active text-white">Edit Tenure</li>
                </ol>
                
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Tenure name</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="tenure_name"
                                                        value={updatedTenure.tenure_name || ''}
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
                                                        value={updatedTenure.amount || ''}
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
                                                        name="validity"
                                                        value={updatedTenure.validity || ''}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <button type="submit" className="btn btn-info">
        Update
    </button>
</div>

                                </form>
                            </div>
                        </div>
                    </div>
          
    );
}

export default Edittenure;
