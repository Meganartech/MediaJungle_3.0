// import React from 'react'
// import Layout from '../Layout/Layout'
// import Head from '../Components/Head'

// const AboutUs = () => {
//   return (
//     <Layout className='container mx-auto min-h-screen  overflow-y-auto'>
//       <div className='px-2 my-6  '>
//         <Head title="About Us" />
//         <div className='xl:py-20 py-10 px-4'>
//           <div className='grid grid-flow-row xl:grid-cols-2 gap-4 xl:gap-16 items-center'>
//             <div>
//               <h3 className='text-xl lg:text-3xl mb-4 font-semibold'>
//                 Welcome to our New10Media Website
//               </h3>
//               <div className='mt-3 text-sm leading-8 text-text'>
//                 <p>
//                   It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
//                 </p>
//                 <p>
//                   It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
//                 </p>
//               </div>
//               <div className='grid md:grid-cols-2 gap-6 mt-8'>
//                 <div className=' bg-dry rounded-lg'>
//                   <span className='text-3xl block font-extrabold mt-4'>
//                     10K
//                   </span>
//                   <h4 className='text-lg font-semibold my-2'>Listed Movies</h4>
//                   <p className='mb-0 text-text leading-7 text-sm'>
//                     Lorem Ipsum is simply dummy text of the printing and typesetting industry.
//                   </p>
//                 </div>
//                 <div className='bg-dry rounded-lg'>
//                   <span className='text-3xl block font-extrabold mt-4'>
//                     8K
//                   </span>
//                   <h4 className='text-lg font-semibold my-2'>Lovely Users</h4>
//                   <p className='mb-0 text-text leading-7 text-sm'>
//                     Completely Free without Registration
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className='mt-10 lg:mt-0  '>
//               <img
//                 src='/images/aboutus.png'
//                 alt='aboutus'
//                 className='w-full xl:block hidden h-header rounded-lg object-cover '
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   )
// }

// export default AboutUs

import React from 'react'
import Layout from '../Layout/Layout'
import Head from '../Components/Head'

const AboutUs = () => {
  return (
    <Layout className='min-height-screen container mx-auto'>
      <div className=' px-2 my-6'>
        <Head title="About Us" />
        <div className='xl:py-20 py-10 px-4'>
          <div className='grid grid-flow-row xl:grid-cols-2 gap-4 xl:gap-16 items-center'>
            <div>
              <h3 className='text-xl lg:text-3xl mb-4 font-semibold'>
                Welcome to our New10Media Website
              </h3>
              <div className='mt-3 text-sm leading-8 text-text'>
                <p>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                </p>
                <p>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                </p>
              </div>
              <div className='grid md:grid-cols-2 gap-6 mt-8' style={{width:'100%'}}>
                <div className='p-8 bg-dry rounded-lg'>
                  <span className='text-3xl block font-extrabold mt-4'>
                    10K
                  </span>
                  <h4 className='text-lg font-semibold my-2'>Listed Movies</h4>
                  <p className='mb-0 text-text leading-7 text-sm'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                </div>
                <div className='p-8 bg-dry rounded-lg'>
                  <span className='text-3xl block font-extrabold mt-4'>
                    8K
                  </span>
                  <h4 className='text-lg font-semibold my-2'>Lovely Users</h4>
                  <p className='mb-0 text-text leading-7 text-sm'>
                    Completely Free without Registration
                  </p>
                </div>
              </div>
            </div>
            <div className='mt-10 lg:mt-0'>
              <img
                src='/images/aboutus.png'
                alt='aboutus'
                className='w-full xl:block hidden h-header rounded-lg object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AboutUs