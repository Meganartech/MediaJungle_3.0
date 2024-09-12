  import React, { useState, useEffect } from 'react';
  import Layout from './Layout/Layout';
  import API_URL from '../Config';
  import Swal from 'sweetalert2';
  import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

  const PlanDetails = () => {
    const [plans, setPlans] = useState([]);
    const [features, setFeatures] = useState([]);
    const [featuresByPlan, setFeaturesByPlan] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [tenures, setTenures] = useState([]);
    const [getall,setGetAll] = useState('');

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
    const sendPaymentIdToServer = async (paymentId, order, status_code, planname, userId, tenureId, signature) => {
    };

    const handlePlanSelect = (plan) => {
      setSelectedPlan(plan);
    };

    const handleTenureSelect = (tenure) => {
      handlePayment(tenure);
    };

    return (
      <Layout className='container mx-auto min-h-screen overflow-y-auto bg-black'>
        {/* <div style={{padding:"20px",margin:"30px",  background: 'linear-gradient(to top, #141335, #0c0d1a)'}}> */}
        <div className='flex justify-center py-10'>
          <div className='overflow-x-auto max-w-4xl w-full rounded-3xl'>
          <table 
  className='w-full table-hover rounded-lg shadow-lg'
  style={{
    background: 'linear-gradient(to bottom, #232224, #3a3a3a)', // Gradient background applied here
  }}
>
  {/* First 3 Rows */}
  <thead>
    <tr>
      <td colSpan={plans.length + 1} className='text-left py-6 px-6'>
        <h1 className='text-2xl text-white font-extrabold font-serif'>Choose the plan that is right for you</h1>
      </td>
    </tr>
    <tr>
      <td colSpan={plans.length + 1} className='text-left py-2 px-6'>
        <p style={{color:"orange"}}>
          Unlimited Movies and TV shows. Watch all you want ad-free.
        </p>
      </td>
    </tr>
    <tr>
      <td colSpan={plans.length + 1} className='text-left py-2 px-6'>
        <p className='text-orange-400' style={{color:"orange"}}>
          Change or cancel your plan anytime.
        </p>
      </td>
    </tr>
  </thead>

  {/* Plan Selection Headers */}
  <thead className='rounded-t-2xl'>
    <tr>
      <th className='py-4 px-6 text-white font-bold uppercase text-sm text-left w-3/12'>
        <div className='col-span-1 lg:block hidden'>
          {getall.length > 0 && getall[0].logo ? (
            <Link to="/">
              <img src={`data:image/png;base64,${getall[0].logo}`} alt='logo' className='w-full object-contain' />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </th>
      {plans.map((plan) => (
        <th
          key={plan.id}
          className={`py-4 px-6 font-bold uppercase text-sm text-center cursor-pointer transition-colors ${
            selectedPlan?.id === plan.id ? 'text-white bg-blue-700 rounded-t-xl' : 'text-white'
          } ${hoveredPlan === plan.id ? 'bg-gray-800 hover:border-hard rounded-t-xl' : ''}`}
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

  {/* Table Body */}
  <tbody>
    {features.map((feature) => (
      <tr key={feature.id} className=' border-bgl'>
        <td className='py-3 px-4  text-white font-medium text-sm'>{feature.features}</td>
        {plans.map((plan) => (
          <td
            key={plan.id}
            className={`py-3 px-4 text-center ${
              selectedPlan?.id === plan.id ? 'bg-blue-700 text-white' : 'text-gray-300'
            } ${hoveredPlan === plan.id ? 'bg-gray-800  text-white' : ''}`}
          >
            {featuresByPlan[plan.id] && featuresByPlan[plan.id].some(f => f.featureId === feature.id && f.active) ? (
              <i className="fa-solid fa-check text-green-500 text-lg"></i>
            ) : (
              <i className="fa-solid fa-times text-red-500 text-lg"></i>
            )}
          </td>
        ))}
      </tr>
    ))}
  </tbody>

  {/* Table Footer */}
  <tfoot>
    <tr>
      <td className='py-3 px-4 text-white font-medium text-sm w-3/12'></td>
      <td colSpan={plans.length} className='py-4 px-6 text-center'>
        {selectedPlan && (
         
          <div className='mt-4 flex justify-center'>
            {/* Tenure Container */}
        
            <div className='bg-cool p-6 rounded-2xl shadow-lg flex flex-wrap justify-center'>
        
              {tenures.map((tenure) => {
                const discountedAmount = calculateDiscountedAmount(
                  selectedPlan.amount,
                  tenure.months,
                  tenure.discount
                );

                return (
                  <div>
                  <button
                    key={tenure.id}
                    className='relative bg-cool text-white hover:bg-hard py-2 px-8 rounded-3xl mr-2 mb-2 transition-transform transform hover:bg-hard-900 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50'
                    onClick={() => handlePayment(tenure)}
                  > 
                    <span className='block text-lg font-semibold'>{tenure.tenure_name}</span>
                    <span className='block text-xl font-extrabold'>
                      &#8377;{Math.round(discountedAmount)}
                    </span>
                  </button></div>
                );
              })}
            </div>
            {/* End of Tenure Container */}
          </div>
        )}
      </td>
    </tr>
  </tfoot>

</table>


          </div>
        </div>
        {/* </div> */}
      </Layout>
    );
  }

  export default PlanDetails;