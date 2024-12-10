import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import Head from '../Components/Head'
import { FiMail, FiMapPin, FiPhoneCall } from 'react-icons/fi'
import { FaEnvelope, FaLocationArrow, FaMap, FaMapMarker, FaPhone } from 'react-icons/fa'

const ContactUs = () => {
    const [contactUsData, setcontactUsData] = useState({
        aboutUsHeaderScript: '',
        aboutUsBodyScript: '',
        featureBox1HeaderScript: '',
        featureBox1BodyScript: '',
        featureBox2HeaderScript: '',
        featureBox2BodyScript: '',
        aboutUsImage:'null',
        contactUsEmail: '',
        contactUsBodyScript: '',
        callUsPhoneNumber: '',
        callUsBodyScript: '',
        locationMapUrl: '',
        locationAddress: '',
        contactUsImage: null, // Handle file upload
        appUrlPlaystore: '',
        appUrlAppStore: '',
        copyrightInfo: '',// default image URL
      });
      console.log(contactUsData);
      useEffect(() => {
        const fetchContactUsData = async () => {
          try {
            const response = await fetch('http://localhost:8080/api/v2/footer-settings');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data); // Log the data to check its structure
            setcontactUsData({
              aboutUsHeaderScript: data.aboutUsHeaderScript || '',
              aboutUsBodyScript: data.aboutUsBodyScript || '',
              featureBox1HeaderScript: data.featureBox1HeaderScript || '',
              featureBox1BodyScript: data.featureBox1BodyScript || '',
              featureBox2HeaderScript: data.featureBox2HeaderScript || '',
              featureBox2BodyScript: data.featureBox2BodyScript || '',
              aboutUsImage: data.aboutUsImage || 'default_image_url', // Provide a default
              contactUsEmail: data.contactUsEmail || '',
              contactUsBodyScript: data.contactUsBodyScript || '',
              callUsPhoneNumber: data.callUsPhoneNumber || '',
              callUsBodyScript: data.callUsBodyScript || '',
              locationMapUrl: data.locationMapUrl || '',
              locationAddress: data.locationAddress || '',
              contactUsImage: data.contactUsImage || null, 
              appUrlPlaystore: data.appUrlPlaystore || '',
              appUrlAppStore: data.appUrlAppStore || '',
              copyrightInfo: data.copyrightInfo || '',
            });
          } catch (error) {
            console.error('Error fetching contact Us data:', error);
          }
        };
      
        fetchContactUsData();
      }, []);
      
 
    return (
        <Layout>
            <div className='min-height-screen container mx-auto px-2 my-6'>
                <Head title="Contact Us" />
                <div className='grid mg: grid-cols-2 gap-10 lg:my-20 my-10 lg:grid-cols-3 xl:gap-8' style={{width:'100%'}}>
              
                            <div  className='border border-border flex-colo p-10 bg-dry rounded-lg text-center'>
                                <span className='flex-colo w-20 h-20 mb-4 rounded-full bg-main text-subMain text-2xl'>
                                    <div style={{ color: '#FFAA1D' }} ><FaEnvelope /></div>
                                </span>
                                <h4 className='text-xl font-semibold mb-2'>Email Us</h4>
                                <h6 className='text-xl font-semibold mb-2'>{contactUsData.contactUsEmail}</h6>
                                <p className='mb-0 text-sm text-text leading-7'>
                                    
                                    {contactUsData.contactUsBodyScript}
                                </p>
                           
                            </div>
                            <div  className='border border-border flex-colo p-10 bg-dry rounded-lg text-center'>
                                <span className='flex-colo w-20 h-20 mb-4 rounded-full bg-main text-subMain text-2xl'>
                                    <div style={{ color: '#FFAA1D' }} ><FaPhone /></div>
                                </span>
                                <h4 className='text-xl font-semibold mb-2'>Call Us</h4>
                                <h6 className='text-xl font-semibold mb-2'>{contactUsData.callUsPhoneNumber}</h6>
                                <p className='mb-0 text-sm text-text leading-7'>
                                    
                                    {contactUsData.callUsBodyScript}
                                </p>
                           
                            </div>
                            <div  className='border border-border flex-colo p-10 bg-dry rounded-lg text-center'>
                                <span className='flex-colo w-20 h-20 mb-4 rounded-full bg-main text-subMain text-2xl'>
                                    <div style={{ color: '#FFAA1D' }} ><FaMapMarker /></div>
                                </span>
                                <h4 className='text-xl font-semibold mb-2'>Location</h4>
                                <h6 className='text-xl font-semibold mb-2'>{contactUsData.locationAddress}</h6>
                                <p className='mb-0 text-sm text-text leading-7'>
                                    
                                    {contactUsData.locationAddress}
                                </p>
                           
                            </div>
                
                </div>
            </div>
        </Layout>
    )
}

export default ContactUs