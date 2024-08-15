import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router} from 'react-router-dom';
import App from './App';
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "aos";n
// import "aos/dist/aos.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <Router>
      <App />
    </Router>
    // const root = ReactDOM.createRoot(document.getElementById('root'));
    // root.render(
      
    //     <App />
    //   </React.StrictMode>
    // );
);

