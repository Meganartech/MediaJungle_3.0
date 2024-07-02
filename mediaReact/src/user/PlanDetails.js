import React, { useState, useEffect } from 'react';
import Layout from './Layout/Layout';
import API_URL from '../Config';
import Swal from 'sweetalert2'

const PlanDetails = () => {

  const [getall,setgetall] = useState('');
  const [GetAll,setGetAll] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetsiteSettings`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetAll(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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


const handlesubmit = async (amount, userId, planname, validity) => {
  try {
    const response = await fetch(`${API_URL}/api/v2/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        userId: userId,
        planname: planname
      })
    });
    const order = await response.text(); // Get the order ID from the response

    if (order.startsWith("You have already paid")) {
      // Handle the case where the user has already paid for the plan
      console.log(order);
      Swal.fire('Info', order, 'info');
      return; // Exit the function
    }

    const options = {
      order_id: order, // Pass the order ID obtained from the server
      name: "Megnar",
      description: "This is for testing",
      handler: async function (response) {
        // Send the payment ID and signature to the server
        await sendPaymentIdToServer(response.razorpay_payment_id, order, response.status_code, planname, userId, amount, validity, response.razorpay_signature);
        // Handle success response
        console.log("Payment successful:", response);
        Swal.fire('Success', 'Payment successful!', 'success');
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: function () {
          // Handle payment dismissal if needed
          console.log("Payment form closed");
          Swal.fire('Info', 'Payment form closed', 'info');
        }
      }
    };

    var pay = new window.Razorpay(options);

    pay.on('payment.failed', function (response) {
      // Handle payment failure
      console.error("Payment failed:", response.error);
      Swal.fire('Error', `Payment failed: ${response.error.description}`, 'error');
    });

    pay.open();
  } catch (error) {
    console.error('Error creating order:', error);
    Swal.fire('Error', 'Error creating order', 'error');
  }
};

const sendPaymentIdToServer = async (paymentId, order, status_code, planname, userId, amount, validity, signature) => {
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
        planname: planname,
        userId: userId,
        amount: amount,
        validity: validity,
        signature: signature
      })
    });
    // Handle response from the server if needed
    console.log('Payment ID and signature sent to server:', response);
    Swal.fire('Success', 'Payment ID and signature sent to server', 'success');
  } catch (error) {
    console.error('Error sending payment ID to server:', error);
    Swal.fire('Error', 'Error sending payment ID to server', 'error');
  }
};

const handleSubscribeClick = (amount, planname, validity) => {
  if (!userId) {
    Swal.fire('Error', 'You are not logged in.', 'error');
  } else {
    handlesubmit(amount, userId, planname, validity);
  }
};
    
return (
  <Layout className='container mx-auto min-h-screen overflow-y-auto'>
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' style={{ marginLeft: '75px' }}>
    {getall && getall.length > 0 && getall.map((plan, index) => (
      <div key={index} className='w-full mb-8 flex'>
        <div className='flex flex-col justify-between p-8 sm:p-14 bg-dry rounded-lg border border-border w-full'>
        {GetAll.length > 0 && GetAll[0].logo ? (
          <img
            src={`data:image/png;base64,${GetAll[0].logo}`}
            alt='logo'
            className='w-full h-12 object-contain'  
          />
          ) : (
            <div></div>
          )}
          <br />
          <form className='flex flex-col flex-grow justify-between' style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto', height: '100%' }}>
            <h2 className='text-3xl mb-10 font-semibold text-center text-white'>{plan.planname}(&#8377;{plan.amount})</h2>
            <div className='flex-1'>
              {plan.descriptions && plan.descriptions.length > 0 ? (
                <div>
                  {plan.descriptions.map((desc, descIndex) => (
                    <div key={descIndex} className="flex items-center mb-6">
                      <span className="inline-block mr-4">
                        {desc.active === 'yes' ? (
                          <i className="fa-solid fa-check text-yellow-600 text-lg"></i>
                        ) : (
                          <i className="fa-solid fa-times text-red-600 text-lg"></i>
                        )}
                      </span>
                      <span className='text-lg font-medium text-gray-500'>{desc.description}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32"></div> // Add a fixed height placeholder if no descriptions are present
              )}
            </div>
            <div className="mt-10">
              <span className='text-lg font-medium text-center text-white'> &#8377;{plan.amount}</span><br></br>
              <div className="mt-12">
                <a
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out"
                  onClick={() => handleSubscribeClick(plan.amount, plan.planname, plan.validity)}
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
