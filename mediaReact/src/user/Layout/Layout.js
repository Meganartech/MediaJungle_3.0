import React from 'react'
import NavBar from './Navbar/NavBar'
import Footer from './Footer/Footer'
import MobileFooter from './Footer/MobileFooter'

const Layout = ({children}) => {
  return (
   <>
   <div className='bg-main text-white overflow-y-auto'>
    <NavBar />
    {children}
    <Footer />
 <MobileFooter/>
   </div>
   </>
  )
}

export default Layout