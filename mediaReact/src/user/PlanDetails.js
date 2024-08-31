import React, { useState, useEffect } from 'react';
import Layout from './Layout/Layout';
import API_URL from '../Config';
import Swal from 'sweetalert2';

const PlanDetails = () => {
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featuresByPlan, setFeaturesByPlan] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllPlans`)
      .then((response) => response.json())
      .then((data) => {
        setPlans(data);
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
        })
        .catch((error) => console.error(`Error fetching features for plan ${planId}:`, error));
    });
  };

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllFeatures`)
      .then((response) => response.json())
      .then((data) => setFeatures(data))
      .catch((error) => console.error('Error fetching all features:', error));
  }, []);

  const userId = sessionStorage.getItem('userId');

  const handleSubscribeClick = (amount, planname, validity) => {
    if (!userId) {
      Swal.fire('Error', 'You are not logged in.', 'error');
    } else {
      handlesubmit(amount, userId, planname, validity);
    }
  };

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
      const order = await response.text();

      if (order.startsWith("You have already paid")) {
        Swal.fire('Info', order, 'info');
        return;
      }

      const options = {
        order_id: order,
        name: "Megnar",
        description: "This is for testing",
        handler: async function (response) {
          await sendPaymentIdToServer(response.razorpay_payment_id, order, response.status_code, planname, userId, validity, response.razorpay_signature);
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

  const sendPaymentIdToServer = async (paymentId, order, status_code, planname, userId, validity, signature) => {
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
          validity: validity,
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

  return (
    <Layout className='container mx-auto min-h-screen overflow-y-auto bg-black'>
      <div className='flex justify-center py-10'>
        <div className='overflow-x-auto max-w-4xl w-full'>
          <table className='w-full table-hover border rounded-lg shadow-lg'>
            <thead className='rounded-t-2xl'>
              <tr>
                <th className='py-4 px-6 text-white font-bold uppercase text-sm text-left'>Features</th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className={`py-4 px-6 font-bold uppercase text-sm text-center cursor-pointer transition-colors ${selectedPlan?.id === plan.id ? ' text-white' : 'text-gray-300'} ${hoveredPlan === plan.id ? 'bg-gray-600 rounded-t-xl' : ''}`}
                    onClick={() => handlePlanSelect(plan)}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    {plan.planname} (&#8377;{plan.amount})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.id} className='border-t border-gray-700'>
                  <td className='py-3 px-4 border-r-2 text-white font-medium text-sm'>{feature.features}</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className={`py-3 px-4 text-center ${selectedPlan?.id === plan.id ? '' : ''} ${hoveredPlan === plan.id ? 'bg-gray-600 ' : ''}`}
                    >
                      {featuresByPlan[plan.id] && featuresByPlan[plan.id].some(f => f.featureId === feature.id && f.active) ? (
                        <i className="fa-solid fa-check text-green-400 text-lg"></i>
                      ) : (
                        <i className="fa-solid fa-times text-red-500 text-lg"></i>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
  <tr>
    <td className='py-3 px-4 text-white font-medium text-sm'></td>
    <td colSpan={plans.length} className='py-4 px-6 text-center'>
      {selectedPlan && (
        <button
          className='bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out'
          onClick={() => handleSubscribeClick(selectedPlan.amount, selectedPlan.planname, selectedPlan.validity)}
        >
          Subscribe to {selectedPlan.planname}
        </button>
      )}
    </td>
  </tr>
</tfoot>

          </table>
        </div>
      </div>
    </Layout>
  );
}

export default PlanDetails;
