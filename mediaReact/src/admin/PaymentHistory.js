// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import API_URL from '../Config';
// import "../css/Sidebar.css";

// const PaymentHistory = () => {
//     const { userId } = useParams(); // Access route parameter
//     const location = useLocation();
//     const [paymentHistory, setPaymentHistory] = useState([]);
//     const userName = location.state?.userName; // Get userName from navigation state
  
//     useEffect(() => {
//         fetchPaymentHistory(userId);
//       }, [userId]);
//       console.log('User Name:', userName); 
//   const fetchPaymentHistory = async (userId) => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v2/paymentHistory/${userId}`);
//       console.log('API Response:', response.data); // Check the response
//       setPaymentHistory(response.data); // Ensure response.data is an array
//     } catch (error) {
//       console.log('Error fetching payment history:', error);
//     }
//   };
  

//   return (
//       <div className='container2 mt-20'>
//         <ol className="breadcrumb mb-4">
       
//           <li className="breadcrumb-item"><Link to="/admin/SubscriptionPayments">Manage Users</Link></li>
//           <li className="breadcrumb-item active text-white">Payment History</li>
//         </ol>
//         <div className="card-body profile-card-body">
//         <table id="datatablesSimple">
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>User Name</th>
//               <th>Plan</th>
//               <th>Payment Id</th>
//               <th>Plan Amount</th>
//               <th>Order Id</th>
//               <th>End Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(paymentHistory) && paymentHistory.length > 0 ? (
//               paymentHistory.map((payment, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{userName}</td>
//                   <td>{payment.subscriptionTitle}</td>
//                   <td>{payment.paymentId}</td>
//                   <td>{payment.amount}</td>
//                   <td>{payment.orderId}</td>
//                   <td>{payment.expiryDate}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9">No payment history found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         </div>
//       </div>
   
//   );
// };

// export default PaymentHistory;



import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../Config';
import "../css/Sidebar.css";

const PaymentHistory = () => {
    const { userId } = useParams(); // Access route parameter
    const location = useLocation();
    const [paymentHistory, setPaymentHistory] = useState([]);
    const userName = location.state?.userName; // Get userName from navigation state
  
    useEffect(() => {
        fetchPaymentHistory(userId);
      }, [userId]);
      console.log('User Name:', userName); 
  const fetchPaymentHistory = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/paymentHistory/${userId}`);
      console.log('API Response:', response.data); // Check the response
      setPaymentHistory(response.data); // Ensure response.data is an array
    } catch (error) {
      console.log('Error fetching payment history:', error);
    }
  };
  

  return (
      <div className='container3 mt-20'>
        <ol className="breadcrumb mb-4 d-flex my-0">
       
          <li className="breadcrumb-item"><Link to="/admin/SubscriptionPayments">Manage Users</Link></li>
          <li className="breadcrumb-item active text-white">Payment History</li>
          <li className="ms-auto text-end text-white">
        Bulk Action
        <button className="ms-2">
          <i className="bi bi-chevron-down"></i>
        </button>
      </li>
        </ol>
        <div className="table-container">
      <table className="table table-striped ">
        <thead>
          <tr className='table-header'>
            <th style={{border: 'none' }}>
              <input type="checkbox" />
            </th>
              <th style={{border: 'none' }}>S.No</th>
              <th style={{border: 'none' }}>User Name</th>
              <th style={{border: 'none' }}>Plan</th>
              <th style={{border: 'none' }}>Payment Id</th>
              <th style={{border: 'none' }}>Plan Amount</th>
              <th style={{border: 'none' }}>Order Id</th>
              <th style={{border: 'none' }}>End Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paymentHistory) && paymentHistory.length > 0 ? (
              paymentHistory.map((payment, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>
                <input type="checkbox" />
              </td>
                  <td>{index + 1}</td>
                  <td>{userName}</td>
                  <td>{payment.subscriptionTitle}</td>
                  <td>{payment.paymentId}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.orderId}</td>
                  <td>{payment.expiryDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No payment history found</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
   
  );
};

export default PaymentHistory;

