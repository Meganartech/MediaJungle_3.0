// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from './navbar';
// import Sidebar from './sidebar';
// import API_URL from '../Config';
// import { Link } from 'react-router-dom';
// import "../css/Sidebar.css";

// const Adminplan = () => {
//   const [planname,setplanname] = useState('');
//   const [amount,setamount] = useState('');
//   const [validity,setvalidity] = useState('');
//   const [getall,setgetall] = useState();

 
  

  
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const formData = new FormData();
//       const planData = {
//         planname: planname,
//         amount: amount,
//         validity: validity,
//       };
//       console.log(planData)
//       for (const key in planData) {
//         formData.append(key, planData[key]);
//       }
//       const response = await axios.post(`${API_URL}/api/v2/PlanDetails`, planData,{
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log(response.data);
//       console.log("plandetails updated successfully");
//       // Handle success, e.g., show a success message to the user
//     } catch (error) {
//       console.error('Error uploading plandetails:', error);
//       // Handle error, e.g., show an error message to the user
//     }
//     setplanname('')
//     setamount('')
//     setvalidity('')
//       }

//   return (
// <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem" }}>
//   <Sidebar />

//   <div className="container-fluid">
//     <div className="container2">
//       <ol className="breadcrumb mb-4">
//         <li className="breadcrumb-item text-white">
//           <Link to="/Dashboard">Dashboard</Link>
//         </li>
//         <li className="breadcrumb-item active">Plan Details</li>
//       </ol>

//       <div className='card-body'>
//                   {/* <form className='form-container'> */}
//                   <div className='modal-body '>
//                     <div className='temp'>
//                     <div className='col-lg-6'>
//                 <label htmlFor="planname">Plan Name</label>
//                 <input
//                   type="text"
//                   name="planname"
//                   id="planname"
//                   className="form-control"
//                   value={planname}
//                   onChange={(e) => setplanname(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="col-lg-6">
//                 <label htmlFor="amount">Amount</label>
//                 <input
//                   type="number"
//                   name="amount"
//                   id="amount"
//                   className="form-control"
//                   value={amount}
//                   onChange={(e) => setamount(e.target.value)}
//                   required
//                   // min="0" // Optional: Set a minimum amount if applicable
//                 />
//                 <br></br>
//               </div>
//                   <div className='col-lg-6'>
//                   <label htmlFor="validity">Validity</label>
//                 <input
//                   type="text"
//                   name="validity"
//                   id="validity"
//                   className="form-control"
//                   value={validity}
//                   onChange={(e) => setvalidity(e.target.value)}
//                   required
//                 />
//               </div>

//            <div className='col-lg-12'>
//             <div className="d-flex justify-content-center" style={{marginTop:"10px"}}> 
//                 {/* Added a new div with col-lg-6 */}
//                   <button className='text-center btn btn-info' onClick={handleSubmit}>
//                     SAVE
//                   </button>
//                 </div>
//               </div>
//             </div>
//             </div>
//             </div>
//             </div>
//             </div>

//       </div>
    
           
    
  
//   );
// };

// export default Adminplan;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import API_URL from '../Config';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";

const Adminplan = () => {
  const [planname,setplanname] = useState('');
  const [amount,setamount] = useState('');
  const [validity,setvalidity] = useState('');
  const [getall,setgetall] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/GetAllPlans`);
      setgetall(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      const planData = {
        planname: planname,
        amount: amount,
        validity: validity,
      };
      console.log(planData)
      for (const key in planData) {
        formData.append(key, planData[key]);
      }
      const response = await axios.post(`${API_URL}/api/v2/PlanDetails`, planData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      console.log("plandetails updated successfully");
      fetchData();
      // Handle success, e.g., show a success message to the user
    } catch (error) {
      console.error('Error uploading plandetails:', error);
      // Handle error, e.g., show an error message to the user
    }
    setplanname('')
    setamount('')
    setvalidity('')
      }

  

  return (
    <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem" }}>
      <Sidebar />

      <div className="container-fluid">
        <div className="container2">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item text-white">
              <Link to="/Dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Plan Details</li>
          </ol>

          <div className="row">
            {/* Left side with the form */}
            <div className="col-lg-6">
              <div className="card-body">
                <form className="form-container" onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="temp">
                      <div className="col-lg-6">
                        <label htmlFor="planname">Plan Name</label>
                        <input
                          type="text"
                          name="planname"
                          id="planname"
                          className="form-control"
                          value={planname}
                          onChange={(e) => setplanname(e.target.value)}
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
                        />
                      </div>
                    </div>
                    <br />
                    <div className="temp">
                      <div className="col-lg-6">
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
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-info">
                        ADD
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Separator line */}
            <div className="col-lg-1 d-flex align-items-center justify-content-center">
              <div style={{ height: "100%", width: "1px", backgroundColor: "skyblue" }}></div>
            </div>

            {/* Right side with "Hello" */}
            <div className="col-lg-5 d-flex flex-column align-items-center justify-content-center">
              {getall && getall.length > 0 ? (
                getall.map((plan, index) => (
                <div key={index} className="w-100 mb-2 d-flex align-items-center">
                        <Link to="/admin/PlanDetailsList" className="w-50">
                          <button className="btn btn-info w-100">
                            {plan.planname}
                          </button>
                        </Link>
                        <Link to="/admin/PlanDescription" className="w-50">
                        <button className="btn btn-secondary ml-2" style={{ marginTop: "15px", marginLeft: "3px" }}>
                          Add
                        </button>
                        </Link>
                </div>
                ))
              ) : (
                <div>No Plans</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminplan;

