import React from 'react'
import NavBar from './sample/NavBar'
import Footer from './sample/Footer'
import MobileFooter from './sample/MobileFooter'

const Layout = ({children}) => {
  return (
   <>
   <div className='bg-main text-white'>
    <NavBar />
    {children}
    <Footer />
    <MobileFooter />
   </div>
   </>
  )
}

export default Layout