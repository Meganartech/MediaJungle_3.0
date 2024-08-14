import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';
import '../css/style.css'; // Import your CSS file

const AddTenure = () => {
    const [tenureName, setTenureName] = useState('');
    const [months, setMonths] = useState('');
    const [discount, setDiscount] = useState('');
    const [selectedMonths, setSelectedMonths] = useState('');
    const [discountOptions, setDiscountOptions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMonthsDropdownOpen, setIsMonthsDropdownOpen] = useState(false);
    const token = sessionStorage.getItem('tokenn');

    // Handle change for months dropdown
    const handleMonthsChange = (value) => {
        const selectedMonths = parseInt(value, 10); // Convert value to number
        setSelectedMonths(selectedMonths);
        setMonths(selectedMonths); // Update months state

        // Define discount options based on selected months
        let options = [];
        if (selectedMonths === 1 || selectedMonths === 2) {
            options = [0];
        } else if (selectedMonths >= 3) {
            options = Array.from({ length: selectedMonths + 1 }, (_, i) => i); // Discounts from 0 to selectedMonths
        }
        setDiscountOptions(options);

        // Close the dropdown
        setIsMonthsDropdownOpen(false);
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
                                <div className="custom-dropdown-container">
                                    <div
                                        className="custom-dropdown-selected"
                                        onClick={() => setIsMonthsDropdownOpen(!isMonthsDropdownOpen)}
                                    >
                                        {months || 'Select Months'}
                                    </div>
                                    {isMonthsDropdownOpen && (
                                        <div className="custom-dropdown-menu">
                                            {[...Array(60).keys()].map(i => (
                                                <div
                                                    key={i + 1}
                                                    className="custom-dropdown-option"
                                                    onClick={() => handleMonthsChange(i + 1)}
                                                >
                                                    {i + 1}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='row py-3 my-3 align-items-center'>
                            <div className='col-md-3'>
                                <label className="custom-label">Discount</label>
                            </div>
                            <div className='col-md-4'>
                                <div className="custom-dropdown-container">
                                    <div
                                        className="custom-dropdown-selected"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {discount || 'Select Discount'}
                                    </div>
                                    {isDropdownOpen && (
                                        <div className="custom-dropdown-menu">
                                            {discountOptions.map(option => (
                                                <div
                                                    key={option}
                                                    className="custom-dropdown-option"
                                                    onClick={() => {
                                                        setDiscount(option);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    {option} Free Month{option > 1 ? 's' : ''}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='row py-3 my-5'>
                            <div className='col-md-8 ms-auto text-end'>
                                <button type="button" className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg">
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
