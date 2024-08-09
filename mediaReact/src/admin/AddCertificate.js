import React, { useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';


const AddCertificate = () => {
  const [certificateName, setCertificateName] = useState(null);
  const [description,setdescription] = useState(null);
  const [issuedby,setissuedby] = useState(null);
  const token = sessionStorage.getItem("tokenn")

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = {
        certificate: certificateName,
        description: description,
        issuedby: issuedby,
      };
      console.log(data);
  
      const response = await axios.post(`${API_URL}/api/v2/AddCertificate`, data, {
        headers: {
          Authorization: token, // Pass the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response.data);
      if (response.data === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Certificate inserted successfully!',
        });
      } else {
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error occurred while inserting certificate.',
        });
      }
      setCertificateName('');
      setdescription('');
      setissuedby('');
    } catch (error) {
      console.error('File upload failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'File upload failed. Please try again later.',
      });
    }
  };
  
  


  return (
    
    <div className='container3 mt-20'>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><Link to="/admin/ViewCertificate">Certificates</Link></li>
        <li className="breadcrumb-item active text-white">Add Certificate</li>
      </ol>
      <div className="container mt-3">
    <div className="row py-3 my-3 align-items-center">
      <div className="col-md-3">
        <label className="custom-label">Certificate Name</label>
      </div>
      <div className="col-md-4">
        <input 
          type='text'
          name='certificate_name'
          id='name'
          required
          value={certificateName}
          onChange={(e) => setCertificateName(e.target.value)}
          className="form-control border border-dark border-2" 
          placeholder="Name" 
        />
      </div>
    </div>

    <div className="row py-3 my-3 align-items-center">
      <div className="col-md-3">
        <label className="custom-label">Description</label>
      </div>
      <div className="col-md-4">
        <input 
          type='text'
          name='description'
          id='name'
          required
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          className="form-control border border-dark border-2" 
          placeholder="Description" 
        />
      </div>
    </div>

    <div className="row py-3 my-3 align-items-center">
      <div className="col-md-3">
        <label className="custom-label">Issued by</label>
      </div>
      <div className="col-md-4">
        <input 
          type='text'
          name='issuedby'
          id='name'
          required
          value={issuedby}
          onChange={(e) => setissuedby(e.target.value)}
          className="form-control border border-dark border-2" 
          placeholder="Issued by" 
        />
      </div>
    </div>

    <div className="row py-3 my-5">
      <div className="col-md-12" style={{ height: '20px' }}></div> {/* Placeholder div for spacing */}
    </div>
    <div className="row py-3 my-5">
      <div className="col-md-8 ms-auto text-end">
      <button className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg">Cancel</button>
        <button className="border border-dark border-2 p-1.5 w-20 mr-10 text-white rounded-lg " onClick={handleSubmit} style={{backgroundColor:'blue'}}
        >Submit</button>
      </div>
    </div>
  </div>
</div>
              
 

  );
};

export default AddCertificate;