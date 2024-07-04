import React, { useState ,useEffect} from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const AdminLayout = () => {
  const [activeLink, setActiveLink] = useState(localStorage.getItem('activeLink') || '/admin/Dashboard');
  
  useEffect(() => {
      localStorage.setItem('activeLink', activeLink);
  }, [activeLink]);

  

  return (
      <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>
        <Sidebar 
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        /> 
          <Outlet />
      </div>
        
     
  );
};

export default AdminLayout;
