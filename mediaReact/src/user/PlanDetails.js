import React from 'react';
import Layout from './Layout/Layout';

const PlanDetails = () => {
  return (
    <Layout className='container mx-auto min-h-screen overflow-y-auto'>
      <div className='px-2 my-20 flex justify-center'>
        {/* Left side div */}
        <div className='w-full sm:w-2/5 mr-4'>
          <div className='gap-8 flex-col p-8 sm:p-14 bg-dry rounded-lg border border-border'>
            <img
              src='/images/logo.png'
              alt='logo'
              className='w-full h-12 object-contain'
            />
            <br />
            <form style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto' }}>
              <h2 className='text-3xl mb-10 font-semibold text-center text-white'>Free</h2>
              
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
                <span className='text-lg font-medium text-gray-500'>Add Free Videos</span>
              </div>

              <div className="flex items-center mb-6">
                <span className="inline-block mr-4">
                  <i className="fa-solid fa-x text-yellow-600 text-lg"></i>
                </span>
                <span className='text-lg font-medium text-gray-500'>HD Videos</span>
              </div>
              <br />
              <br />
              <br />
              <div className="mt-12">
                <button type="submit" className='bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out'>
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side div */}
        <div className='w-full sm:w-2/5'>
          <div className='gap-8 flex-col p-8 sm:p-14 bg-dry rounded-lg border border-border'>
            <img
              src='/images/logo.png'
              alt='logo'
              className='w-full h-12 object-contain'
            />
            <br />
            <form style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto' }}>
              <h2 className='text-3xl mb-10 font-semibold text-center text-white'>Paid</h2>
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
                <span className='text-lg font-medium text-gray-500'>Add Free Videos</span>
              </div>

              <div className="flex items-center mb-6">
                <span className="inline-block mr-4">
                  <i className="fa-solid fa-x text-yellow-600 text-lg"></i>
                </span>
                <span className='text-lg font-medium text-gray-500'>HD Videos</span>
              </div>

              <div className="mt-10">
                <span className='text-lg font-medium text-center text-white'> &#8377;800/Year</span><br></br>
                <span className='text-lg font-medium text-center text-white'> &#8377;150/Month</span><br></br>
                <div className="mt-12">
                  <button type="submit" className='bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out'>
                    Subscribe
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PlanDetails;
