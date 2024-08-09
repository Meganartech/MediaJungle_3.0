import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";

const TenureList = () => {
    const navigate = useNavigate(); // Initialize navigate

    const handleClick = (link) => {
        navigate(link);
    };

    return (
        <div className="marquee-container">
            <div className='AddArea'>
                <button className='btn btn-custom' onClick={() => handleClick("/admin/AddTenure")}>Add Tenure</button>
            </div>
            <br />
            <div className='container2'>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item text-white">
                        <Link to="/admin/TenureList">Tenures</Link>
                    </li>
                </ol>
                <div className="card-body profile-card-body">
                    <table id="datatablesSimple">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Tenure name</th>
                                <th>Amount</th>
                                <th>Validity</th>
                                <th>Action</th>
                                <th>Add Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Quarterly</td>
                                <td>250</td>
                                <td>30</td>
                                <td>
                                    <button>
                                        <i className="fas fa-edit" aria-hidden="true"></i>
                                    </button>
                                    <button>
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-secondary ml-2">
                                        Add
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TenureList;
