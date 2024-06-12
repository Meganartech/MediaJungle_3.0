import React, { useState, useEffect } from 'react';
import Layout from './Layout/Layout';
import API_URL from '../Config';

const PlanDetails = () => {

  const [getall,setgetall] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllPlans`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setgetall(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const userId = sessionStorage.getItem('userId')
  console.log(userId)



//   const handlesubmit = async (amount, userId) => {
//     try {
//       const response = await fetch(`${API_URL}/api/v2/payment`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           amount: amount,
//           userId: userId
//         })
//       });
//       const order = await response.text(); // Get the order ID from the response

//       const options = {
//         order_id: order, // Pass the order ID obtained from the server
//         name: "Megnar", 
//         description: "This is for testing",
//         handler: function (response) {
//           // Send the payment ID to the server
//           sendPaymentIdToServer(response.razorpay_payment_id, order, response.razorpay_signature);
//       },
//         theme: {
//           color: "#3399cc"
//         }
//       };

//       var pay = new window.Razorpay(options);
//       pay.open();
//     } catch (error) {
//       console.error('Error creating order:', error);
//     }
//   };
//   const sendPaymentIdToServer = async (paymentId, order, signature) => {
//     try {
//         const response = await fetch(`${API_URL}/api/v2/buy`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 paymentId: paymentId,
//                 orderId: order,
//                 signature: signature
//             })
//         });
//         // Handle response from the server if needed
//     } catch (error) {
//         console.error('Error sending payment ID to server:', error);
//     }
// };

const handlesubmit = async (amount, userId,planname,validity) => {
  try {
    const response = await fetch(`${API_URL}/api/v2/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        userId: userId
      })
    });
    const order = await response.text(); // Get the order ID from the response

    const options = {
      order_id: order, // Pass the order ID obtained from the server
      name: "Megnar",
      description: "This is for testing",
      handler: async function (response) {
        // Send the payment ID and signature to the server
        await sendPaymentIdToServer(response.razorpay_payment_id, order,response.status_code,planname,userId,amount,validity);
        // Handle success response
        console.log("Payment successful:", response);
        alert("Payment successful!");
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: function () {
          // Handle payment dismissal if needed
          console.log("Payment form closed");
          alert("Payment form closed");
        }
      }
    };

    var pay = new window.Razorpay(options);

    pay.on('payment.failed', function (response) {
      // Handle payment failure
      console.error("Payment failed:", response.error);
      alert("Payment failed: " + response.error.description);
    });

    pay.open();
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

const sendPaymentIdToServer = async (paymentId, order, status_code,planname,userId,amount,validity) => {
  try {
    const response = await fetch(`${API_URL}/api/v2/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentId: paymentId,
        orderId: order,
        status_code: status_code,
        planname:planname,
        userId:userId,
        amount:amount,
        validity:validity
      })
    });
    // Handle response from the server if needed
    console.log('Payment ID and signature sent to server:', response);
  } catch (error) {
    console.error('Error sending payment ID to server:', error);
  }
};

const handleSubscribeClick = (amount,planname,validity) => {
  if (!userId) {
    alert('You are not logged in.');
  } else {
    handlesubmit(amount, userId,planname,validity);
  }
}; 
    
return (
<Layout className='container mx-auto min-h-screen overflow-y-auto'>
 
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' style={{ marginLeft: '75px' }}>
  {getall && getall.length > 0 && getall.map((plan, index) => (
    <div key={index} className='w-full mb-8'>
      <div className='gap-8 flex-col p-8 sm:p-14 bg-dry rounded-lg border border-border'>
        <img
          src='/images/logo.png'
          alt='logo'
          className='w-full h-12 object-contain'
        />
        <br />
        <form style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto' }}>
          <h2 className='text-3xl mb-10 font-semibold text-center text-white'>{plan.planname}(&#8377;{plan.amount})</h2>
          <div className="flex items-center mb-6">
            <span className="inline-block mr-4">
              <i className="fa-solid fa-check text-yellow-600 text-lg"></i>
            </span>
            <span className='text-lg font-medium text-gray-500'>Videos and Audios</span>
          </div>
          <div className="flex items-center mb-6">
            <span className="inline-block mr-4">
              <i className="fa-solid fa-check text-yellow-600 text-lg"></i>
            </span>
            <span className='text-lg font-medium text-gray-500'>Multiple Users</span>
          </div>
          <div className="flex items-center mb-6">
            <span className="inline-block mr-4">
              <i className="fa-solid fa-x text-yellow-600 text-lg"></i>
            </span>
            <span className='text-lg font-medium text-gray-500'>Ad Free Videos</span>
          </div>
          <div className="flex items-center mb-6">
            <span className="inline-block mr-4">
              <i className="fa-solid fa-x text-yellow-600 text-lg"></i>
            </span>
            <span className='text-lg font-medium text-gray-500'>HD Videos</span>
          </div>
          <div className="mt-10">
            <span className='text-lg font-medium text-center text-white'> &#8377;{plan.amount}</span><br></br>
            <div className="mt-12">
                    <a
                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out"
                      onClick={() => handleSubscribeClick(plan.amount,plan.planname,plan.validity)}
                    >
                      Subscribe
                    </a>
              </div>
          </div>
        </form>
      </div>
    </div>
  ))}
</div>
</Layout>

  )
}

export default PlanDetails;
