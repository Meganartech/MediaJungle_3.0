import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const AddTenure = () => {

    const [tenurename,settenurename] = useState('');
    const [amount,setamount] = useState('');
    const [validity,setvalidity] = useState('');

    const [description,setdescription] = useState('')
  return (
 
    <div className="container-fluid con-flu">
    <div className="container2">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item ">
        <Link to="/admin/TenureList">Tenures</Link>
        </li>
        <li className="breadcrumb-item active text-white">Add Tenure</li>
      </ol>

      <div className='card-body'>
                  {/* <form className='form-container'> */}
                  <div className='modal-body '>
                    <div className='temp'>
                    <div className='col-lg-6'>
                <label htmlFor="tenurename">Tenure Name</label>
                <input
                  type="text"
                  name="tenurename"
                  id="tenurename"
                  className="form-control"
                  value={tenurename}
                  onChange={(e) => settenurename(e.target.value)}
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
                  onChange={(e) => setamount(e.target.value)}
                  required
                  // min="0" // Optional: Set a minimum amount if applicable
                />
                <br></br>
              </div>
                  <div className='col-lg-6'>
                  <label htmlFor="validity">Validity</label>
                <input
                  type="text"
                  name="validity"
                  id="validity"
                  className="form-control"
                  value={validity}
                  onChange={(e) => setvalidity(e.target.value)}
                  required
                />
              </div>

           <div className='col-lg-12'>
            <div className="d-flex justify-content-center" style={{marginTop:"10px"}}> 
                {/* Added a new div with col-lg-6 */}
                  <button className='text-center btn btn-info'>
                    SAVE
                  </button>
                </div>
              </div>
            </div>
            </div>
            </div>

            </div>
            </div>

    
    
           
    
  
  );
};


export default AddTenure