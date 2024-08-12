import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';

const AddTenure = () => {
    const [tenureName, setTenureName] = useState('');
    const [months, setMonths] = useState('');
    const [discount, setDiscount] = useState('');
    const [selectedMonths, setSelectedMonths] = useState('');
    const [discountOptions, setDiscountOptions] = useState([]);
    const token = sessionStorage.getItem('tokenn');

    const handleMonthsChange = (e) => {
        const selectedMonths = parseInt(e.target.value, 10); // Convert input to number
        setSelectedMonths(selectedMonths);
    
        // Define discount options based on selected months
        let options = [];
        if (selectedMonths === 1 || selectedMonths === 2) {
            options = [0];
        } else if (selectedMonths >= 3) {
            options = Array.from({ length: selectedMonths + 1 }, (_, i) => i); // Discounts from 0 to selectedMonths
        }
        setDiscountOptions(options);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            tenure_name: tenureName,
            months: selectedMonths,
            discount: discount
        };

        console.log('Submitting data:', data);

        try {
            const response = await fetch(`${API_URL}/api/v2/addtenure`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('Response Status:', response.status);
            const responseData = await response.json();
            console.log('Response Data:', responseData);

            if (responseData.id) {
                setTenureName('');
                setMonths('');
                setDiscount('');

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Tenure inserted successfully!',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: responseData.message || 'Error occurred while inserting tenure.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while inserting the tenure.',
            });
        }
    };

    return (
        <div className='container3 mt-20'>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                    <Link to="/admin/TenureList">Tenures</Link>
                </li>
                <li className="breadcrumb-item active text-white">Add Tenure</li>
            </ol>

            <div className="container mt-3">
                <form className='form-container' onSubmit={handleSubmit}>
                    <div className='modal-body'>
                        <div className='row py-3 my-3 align-items-center'>
                            <div className='col-md-3'>
                                <label className="custom-label">Tenure Name</label>
                            </div>
                            <div className='col-md-4'>
                                <input
                                    type="text"
                                    name="tenureName"
                                    id="tenureName"
                                    className="form-control border border-dark border-2"
                                    value={tenureName}
                                    onChange={(e) => setTenureName(e.target.value)}
                                    required
                                    placeholder="Tenure Name"
                                />
                            </div>
                        </div>

                        <div className='row py-3 my-3 align-items-center'>
                            <div className='col-md-3'>
                                <label className="custom-label">No of Months</label>
                            </div>
                            <div className='col-md-4'>
                                <select
                                    name="months"
                                    id="months"
                                    className="form-control border border-dark border-2"
                                    value={selectedMonths}
                                    onChange={(e) => {
                                        setMonths(e.target.value);
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

                        <div className='row py-3 my-3 align-items-center'>
                            <div className='col-md-3'>
                                <label className="custom-label">Discount</label>
                            </div>
                            <div className='col-md-4'>
                                <select
                                    name="discount"
                                    id="discount"
                                    className="form-control border border-dark border-2"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
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

                        <div className='row py-3 my-5'>
                            <div className='col-md-8 ms-auto text-end'>
                                <button className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                                    style={{ backgroundColor: 'blue' }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTenure;
