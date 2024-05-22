import React from 'react'
import { Route, Navigate } from 'react-router-dom';

const UserPrivateRouter = ({ element, isAuthenticated, ...rest }) => {
  
    return  isAuthenticated==="true" ? element : <Navigate to="/UserLogin" />;
  
}

export default UserPrivateRouter