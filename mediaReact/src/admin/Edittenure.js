import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';

const EditTenure = () => {
    const id = localStorage.getItem('items');
    const [selectedMonths, setSelectedMonths] = useState('');
    const [updatedTenure, setUpdatedTenure] = useState({
        tenure_name: '',
        months: '',
        discount: ''
    });
    const [discountOptions, setDiscountOptions] = useState([]);
    const token = sessionStorage.getItem('token');

    const handleMonthsChange = (e) => {
        const selectedMonths = parseInt(e.target.value, 10);
        setSelectedMonths(selectedMonths);
    
        // Define discount options based on selected months
        let options = [];
        if (selectedMonths === 1 || selectedMonths === 2) {
            options = [0];
        } else if (selectedMonths >= 3) {
            options = Array.from({ length: selectedMonths + 1 }, (_, i) => i);
        }
        setDiscountOptions(options);
    };

    useEffect(() => {
        fetch(`${API_URL}/api/v2/tenures/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched tenure data:', data);
                setUpdatedTenure(data);

                // Initialize discount options based on fetched data
                handleMonthsChange({ target: { value: data.months } });
            })
            .catch(error => {
                console.error('Error fetching tenure:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTenure(prevTenure => ({
            ...prevTenure,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log('Submitting data:', updatedTenure);
    
        try {
            const response = await fetch(`${API_URL}/api/v2/edittenure/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTenure),
            });
    
            console.log('Response Status:', response.status);
            const responseData = await response.json();
            console.log('Response Data:', responseData);
        
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Tenure details successfully updated',
            });
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while updating the tenure',
            });
        }
    };
    
    return (
        <div className='container3 mt-20'>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                    <Link to="/admin/TenureList">Tenures</Link>
                </li>
                <li className="breadcrumb-item active text-white">Edit Tenure</li>
            </ol>

            <div className="container mt-3">
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="row py-3 my-3 align-items-center">
                            <div className="col-md-3">
                                <label className="custom-label">Tenure Name</label>
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="tenure_name"
                                    id="tenure_name"
                                    className="form-control border border-dark border-2"
                                    value={updatedTenure.tenure_name || ''}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tenure Name"
                                />
                            </div>
                        </div>

                        <div className="row py-3 my-3 align-items-center">
                            <div className="col-md-3">
                                <label className="custom-label">No of Months</label>
                            </div>
                            <div className="col-md-4">
                                <select
                                    name="months"
                                    id="months"
                                    className="form-control border border-dark border-2"
                                    value={updatedTenure.months || ''}
                                    onChange={(e) => {
                                        handleChange(e);
                                        handleMonthsChange(e); // Update discount options when months change
                                    }}
                                    required
                                >
                                    <option value="">Select Months</option>
                                    {[...Array(60).keys()].map(i => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row py-3 my-3 align-items-center">
                            <div className="col-md-3">
                                <label className="custom-label">Discount</label>
                            </div>
                            <div className="col-md-4">
                                <select
                                    name="discount"
                                    id="discount"
                                    className="form-control border border-dark border-2"
                                    value={updatedTenure.discount || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Discount</option>
                                    {discountOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option} Free Month{option > 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row py-3 my-5">
                            <div className="col-md-8 ms-auto text-end">
                                <button
                                    type="submit"
                                    className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                                    style={{ backgroundColor: 'blue' }}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTenure;
