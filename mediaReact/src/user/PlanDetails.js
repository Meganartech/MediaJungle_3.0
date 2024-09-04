import React, { useState, useEffect } from 'react';
import Layout from './Layout/Layout';
import API_URL from '../Config';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

const PlanDetails = () => {
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featuresByPlan, setFeaturesByPlan] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [tenures, setTenures] = useState([]);

  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    fetch(`${API_URL}/api/v2/tenures`)
      .then((response) => response.json())
      .then((data) => {
        setTenures(data);
        console.log('Fetched Tenures:', data);
      })
      .catch((error) => console.error('Error fetching tenures:', error));
  }, []);
  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllPlans`)
      .then((response) => response.json())
      .then((data) => {
        setPlans(data);
        console.log('Fetched Plans:', data);
  
        // Set the first plan as the selected plan initially
        if (data.length > 0) {
          setSelectedPlan(data[0]);  
        }
  
        const planIds = data.map(plan => plan.id);
        fetchFeaturesForPlans(planIds);
      })
      .catch((error) => console.error('Error fetching plans:', error));
  }, []);
  

  const fetchFeaturesForPlans = (planIds) => {
    planIds.forEach((planId) => {
      fetch(`${API_URL}/api/v2/GetFeaturesByPlanId?planId=${planId}`)
        .then((response) => response.json())
        .then((data) => {
          setFeaturesByPlan((prev) => ({ ...prev, [planId]: data }));
          console.log(`Fetched Features for Plan ${planId}:`, data);
        })
        .catch((error) => console.error(`Error fetching features for plan ${planId}:`, error));
    });
  };

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllFeatures`)
      .then((response) => response.json())
      .then((data) => {
        setFeatures(data);
        console.log('Fetched Features:', data);
      })
      .catch((error) => console.error('Error fetching all features:', error));
  }, []);

  const userId = sessionStorage.getItem('userId');

  const calculateDiscountedAmount = (monthlyAmount, totalMonths, discountedMonths) => {
    const validMonthlyAmount = Number(monthlyAmount) || 0;
    const validTotalMonths = Number(totalMonths) || 1;
    const validDiscountedMonths = Number(discountedMonths) || 0;
    const totalAmount = validMonthlyAmount * validTotalMonths;
    const discountAmount = validMonthlyAmount * validDiscountedMonths;
    const finalAmount = totalAmount - discountAmount;
    return finalAmount;
  };

  const handlePayment = async (tenure) => {
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      Swal.fire('Error', 'You are not logged in. Redirecting to login page...', 'error').then(() => {
        window.location.href = '/UserLogin'; // Redirect to login page
      });
      return;
    }
  
    if (!selectedPlan) {
      Swal.fire('Error', 'Please select a plan.', 'error');
      return;
    }
  
    // Calculate the discounted amount
    const discountedAmount = calculateDiscountedAmount(
      selectedPlan.amount,
      tenure.months,
      tenure.discount
    );
  
    console.log('Selected Plan Amount:', selectedPlan.amount);
    console.log('Tenure Discounted Amount:', discountedAmount);
  
    try {
      const response = await fetch(`${API_URL}/api/v2/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: discountedAmount,  // Ensure this is the discounted amount
          userId: userId,
          planname: selectedPlan.planname
        })
      });
      const order = await response.text();
      console.log('Order Response:', order);
  
      if (order.startsWith("You have already paid")) {
        Swal.fire('Info', order, 'info');
        return;
      }
  
      const options = {
        order_id: order,
        name: "Megnar",
        description: "This is for testing",
        handler: async function (response) {
          console.log('Payment Response:', response);
          await sendPaymentIdToServer(response.razorpay_payment_id, order, response.status_code, selectedPlan.planname, userId, tenure.id, response.razorpay_signature);
          Swal.fire('Success', 'Payment successful!', 'success');
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function () {
            Swal.fire('Info', 'Payment form closed', 'info');
          }
        }
      };
  
      var pay = new window.Razorpay(options);
  
      pay.on('payment.failed', function (response) {
        Swal.fire('Error', `Payment failed: ${response.error.description}`, 'error');
      });
  
      pay.open();
    } catch (error) {
      Swal.fire('Error', 'Error creating order', 'error');
    }
  };
  
  const sendPaymentIdToServer = async (paymentId, order, status_code, planname, userId, tenureId, signature) => {
    try {
      await fetch(`${API_URL}/api/v2/buy`, {
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
          tenureId: tenureId,
          signature: signature
        })
      });
      Swal.fire('Success', 'Payment ID and signature sent to server', 'success');
    } catch (error) {
      Swal.fire('Error', 'Error sending payment ID to server', 'error');
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleTenureSelect = (tenure) => {
    handlePayment(tenure);
  };

  return (
    <Layout className='container mx-auto min-h-screen overflow-y-auto bg-black'>
      <div className='container bg-gray-500' style={{padding:"20px",margin:"30px"}}>
      <div className='flex justify-center py-10'>
        <div className='overflow-x-auto max-w-4xl w-full'>
         <table className='w-full table-hover border rounded-lg shadow-lg'>
  <thead className='rounded-t-2xl'>
    <tr>
      <th className='py-4 px-6 text-black font-bold uppercase text-sm text-left w-3/12'>Features</th>
      {plans.map((plan) => (
        <th
          key={plan.id}
          className={`py-4 px-6 font-bold uppercase text-sm text-center cursor-pointer transition-colors ${
            selectedPlan?.id === plan.id ? 'text-black bg-blue-700 rounded-t-xl' : 'text-black'
          } ${hoveredPlan === plan.id ? 'bg-gray-600 rounded-t-xl' : ''}`}
          onClick={() => handlePlanSelect(plan)}
          onMouseEnter={() => setHoveredPlan(plan.id)}
          onMouseLeave={() => setHoveredPlan(null)}
        >
          <div className='mb-2'>
                      <input
                        type='radio'
                        name='plan'
                        checked={selectedPlan?.id === plan.id}
                        onChange={() => handlePlanSelect(plan)}
                        className='form-radio text-blue-500 h-4 w-4'
                      />
                    </div>
          {plan.planname} (&#8377;{plan.amount})
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {features.map((feature) => (
      <tr key={feature.id} className='border-t border-black'>
        <td className='py-3 px-4 border-r-2 text-black font-medium text-sm'>{feature.features}</td>
        {plans.map((plan) => (
          <td
            key={plan.id}
            className={`py-3 px-4 text-center ${
              selectedPlan?.id === plan.id ? 'bg-blue-700 text-black' : 'text-gray-300'
            } ${hoveredPlan === plan.id ? 'bg-gray-600 text-black' : ''}`}
          >
            {featuresByPlan[plan.id] && featuresByPlan[plan.id].some(f => f.featureId === feature.id && f.active) ? (
              <i className="fa-solid fa-check text-green-900 text-lg"></i>
            ) : (
              <i className="fa-solid fa-times text-red-900 text-lg"></i>
            )}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr>
      <td className='py-3 px-4 text-black font-medium text-sm w-3/12'></td>
      <td colSpan={plans.length} className='py-4 px-6 text-center'>
        {selectedPlan && (
          <div className='mt-4 flex flex-wrap justify-center'>
           {tenures.map((tenure) => {
  const discountedAmount = calculateDiscountedAmount(
    selectedPlan.amount,
    tenure.months,
    tenure.discount
  );

  return (
    <button
      key={tenure.id}
      className='relative bg-blue-800 text-black py-2 px-8 rounded-lg mr-2 mb-2 transition-transform transform hover:bg-green-900 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50'
      onClick={() => handlePayment(tenure)}
    >
      <span className='block text-lg font-semibold'>{tenure.tenure_name}</span>
      <span className='block text-xl font-extrabold'>&#8377;{Math.round(discountedAmount)}</span>
    </button>
  );
})}

          </div>
        )}
      </td>
    </tr>
  </tfoot>
</table>

        </div>
      </div>
      </div>
    </Layout>
  );
}

export default PlanDetails;
