import React from 'react'
import Layout from './Layout/Layout'
import siva from '../img/siva.png' 

const VideoScreen = () => {

  const id = localStorage.getItem('items');

   // Sample images
   const images = [
    { id: 1, src: siva, alt: 'Image 1' },
    { id: 2, src: siva, alt: 'Image 2' },
    { id: 3, src: siva, alt: 'Image 3' }
  ];
  return (
   
    <Layout className='container mx-auto min-h-screen overflow-y-auto'>
      {/* Rounded container with background */}
      <div className='w-full h-96 rounded-lg overflow-hidden relative border-2 border-yellow-500'>
        <div className='absolute top-0 left-0 bottom-0 right-0 bg-blue-500 bg-opacity-30'></div>
        {/* Additional content or components inside the rounded container */}
        
        </div>
        {/* Example: */}
        
        <p className='px-4'>Cast and Crew</p>
      {/* Image Gallery Section */}
      <div className='flex flex-wrap mt-4 px-4'>
        {images.map((image) => (
          <div key={image.id} className='h-24 w-24 rounded-full overflow-hidden shadow-md mr-4 mb-4'>
            <img src={image.src} alt={image.alt} className='h-full w-full object-cover' />
          </div>
        ))}
      </div>

    </Layout>
    
    


  )
}

export default VideoScreen