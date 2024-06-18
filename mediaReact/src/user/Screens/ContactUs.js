import React from 'react'
import Layout from '../Layout/Layout'
import Head from '../Components/Head'
import { FiMail, FiMapPin, FiPhoneCall } from 'react-icons/fi'

const ContactUs = () => {
    const ContactData = [
        {
            id: 1,
            title: "Email Us",
            info: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
            icon: FiMail,
            contact: 'info@meganar.com'
        },
        {
            id: 2,
            title: "Call Us",
            info: "This book is a treatise on the theory of ethics, very popular during the Renaissance.",
            icon: FiPhoneCall,
            contact: '+91 9095313557'
        },
        {
            id: 3,
            title: "Location",
            info: "Dar es salaam, tansania, 345 kigamboni, Street No.12",
            icon: FiMapPin,
            contact: ''
        }

    ]
    return (
        <Layout>
            <div className='min-height-screen container mx-auto px-2 my-6'>
                <Head title="Contact Us" />
                <div className='grid mg: grid-cols-2 gap-10 lg:my-20 my-10 lg:grid-cols-3 xl:gap-8' style={{width:'100%'}}>
                    {
                        ContactData.map((item) => (
                            <div key={item.id} className='border border-border flex-colo p-10 bg-dry rounded-lg text-center'>
                                <span className='flex-colo w-20 h-20 mb-4 rounded-full bg-main text-subMain text-2xl'>
                                    <item.icon style={{ color: '#FFAA1D' }} />
                                </span>
                                <h5 className='text-xl font-semibold mb-2'>{item.title}</h5>
                                <p className='mb-0 text-sm text-text leading-7'>
                                    <a href={`mailto:${item.contact}`} className='text-blue-600'>
                                        {item.contact}
                                    </a>{'  '}
                                </p>
                                {item.info}
                            </div>

                        ))
                    }
                </div>
            </div>
        </Layout>
    )
}

export default ContactUs