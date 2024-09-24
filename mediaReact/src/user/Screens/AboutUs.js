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
url="https://lh3.googleusercontent.com/pw/AP1GczP7REQ8i_gJpBU7u9OzYfCioso7Mi9eWH95qmk554rDF1nWrcZ8uxxlPY9A5XGDer9OPV54iJQVX0NaxmbDQBBACN0kJrfC2BLkU6djiTa7cUMcTL-p4ntB61_Gfpc_MAnZIlcOI2ynHXzRA1d1Nt7NgFToHfRrfiACDDmU8K-PyiN5-0xWf1tGwWFTSvr0-0ty8wAtxjwCqGS7T5b_eEsUKSmmvvC6NDbYpmH5P51ANus6MepI-g5HgPL8G8amqmM-Uw6zGPTsiJB6ok4Fq_0bOwOKfcFgK6xuc_qbKXef4seeUk7Mav8BPZSE7ty5qBxyuSGfFnYiCHH5RsNywDJYG-cZXGZoFouI6Oj3hIEB5q97W4nfiepXcSrUYYAFU12DvBNozDWNAifVcqVJuv-Ixo9yzafqKINCQjeSZ1RyKJd_-kYQRnukuOUtApmQRC_hJVurfolcPrAOJ22CsjTlxAqpV_hzb72wk2-r7HK-Zno1Av3z6-NiY4U6xfC9bPcyjk_ok-a1cIiUQ1bzAyFHNEnkwrsHwPCDy9XjxYIRGfzE57gTtCos89WRq4osRN-I4W6d15UwyoD-pDrsHYXmhvRa7Q31Uy0u1Yl2qHCWwOJ2U2DrCLVu-Dy-WMnXDN-2xvkkOGK-l5s-oRLOOAsNR3i43ZrIm27qvN8DM_2Xw9u_swP8ZqqR_1xghLSJ1AFRhT3JQHTYYdpZJ5ejX9ErfRbmeM3id34fMohMMd89Xic1DyWnh9kwaxIPQVB75VE-GhZwcsxNiJOXR3E2a8bKeC1TQesGtdbJ2bLFXR9RLuqFxg8E2VpOb9iTdtqqq3IZ2psb_eobWhG0DkP68r4xi2fRrW6hBa8Gb1ILVB__bip32MrNucKQCjCs8bWQsSAEKXe1M-SyjWA_SsPfFyQDmjlC1k55dhp28oqYU8a7ZpmEXyfycLFriOkMIE3JEArYDMhwpUaljfhw=w780-h1040-no"
  alt="aboutus"
  className="w-full xl:block hidden h-header rounded-lg object-cover"
/>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AboutUs