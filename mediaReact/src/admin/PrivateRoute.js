// // PrivateRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ element, isAuthenticated }) => {
//   const initial = sessionStorage.getItem('initialsignup') === 'true';

//   if (!initial) {
//     return <Navigate to="/AdminSignin" />;
//   }

//   return isAuthenticated ? element : <Navigate to="/admin" />;
// };

// export default PrivateRoute;



// export default PrivateRoute;

// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = ({ element,isAuthenticated }) => {
//   const initial = sessionStorage.getItem('initialsignup') === 'true';

//   if (!initial) {
//     // If `initial` is not true, redirect to /adminsignin
//     return <Navigate to="/AdminSignin" />;
//   }
  
//   if (!isAuthenticated) {
//     // If not authenticated, redirect to /admin (login screen)
//     return <Navigate to="/admin" />;
//   }

//   // If authenticated, render the nested routes
//   return element;
// };

// export default PrivateRoute;

// PrivateRoute.js
// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';

// const PrivateRoute = ({ element, isAuthenticated, ...rest }) => 




// {

//   return  isAuthenticated ? element : <Navigate to="/admin" />;
// };

// export default PrivateRoute;


import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated }) => {
  const initial = sessionStorage.getItem('initialsignup') === 'true';

  if (!initial) {
    // If `initialsignup` is false, redirect to /AdminSignin
    return <Navigate to="/AdminSignin" />;
  }
  
  if (!isAuthenticated) {
    // If authenticated is false and initialsignup is true, redirect to /admin (login screen)
    return <Navigate to="/admin" />;
  }

  // If authenticated, render the nested routes
  return element;
};

export default PrivateRoute;
