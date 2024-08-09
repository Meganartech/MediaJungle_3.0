import React, { useState ,useEffect} from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const ViewCertificate= () => {
  const [certificate, setCertificate] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('tokenn')
  const handleClick = (link) => {
    navigate(link);
  }
  useEffect(() => {
    // fetch category data from the backend
    fetch(`${API_URL}/api/v2/GetAllCertificate`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCertificate(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);




const handleDeleteCertificate = (certificateId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this certificate. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${API_URL}/api/v2/DeleteCertificate/${certificateId}`, {
        method: 'DELETE',
        headers:{
          Authorization:token,
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // If the response status is OK, don't attempt to parse JSON from an empty response
        return response.status === 204 ? null : response.json();
      })
      .then(data => {
        if (!data) {
          console.log('Certificate deleted successfully');
          // Remove the deleted certificate from the local state
          setCertificate(prevCertificates => prevCertificates.filter(certificate => certificate.id !== certificateId));
          Swal.fire(
            'Deleted!',
            'Your certificate has been deleted.',
            'success'
          );
        } else {
          console.error('Error deleting certificate:', data.error); // Log error message from server
          Swal.fire(
            'Error!',
            `Failed to delete certificate: ${data.error}`,
            'error'
          );
        }
      })
      .catch(error => {
        console.error('Error deleting certificate:', error);
        Swal.fire(
          'Error!',
          'There was a problem deleting your certificate. Please try again later.',
          'error'
        );
      });
    }
  });
};


  const handlEdit = async (certificateId) => {
    localStorage.setItem('items', certificateId);
    navigate('/admin/EditCertificate');
  };
  
  
return (
 
  <div className="marquee-container">
     <div className='AddArea'>
          <button className='btn btn-custom' onClick={() => handleClick("/admin/AddCertificate")}>Add Certificate</button>
        </div><br/>
    <div className='container3'>
    <ol className="breadcrumb mb-4 d-flex  my-0">
    <li className="breadcrumb-item text-white">Certificates
    </li>
    <li className="ms-auto text-end text-white">
          Bulk Action
          <button className="ms-2">
            <i className="bi bi-chevron-down"></i>
          </button>
        </li>
    </ol>
    <div className="table-container">
    <table class="table table-striped">
    <thead>
            <tr className='table-header'>
              < th style={{border: 'none' }}>
                <input type="checkbox" />
              </th>
              <th style={{border: 'none' }}>S.NO</th>
              <th style={{border: 'none' }}>CERTIFICATE NAME</th>
              <th style={{border: 'none' }}>DESCRIPTION</th>
              <th style={{border: 'none' }}>ISSUED BY</th>
              <th style={{border: 'none' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {certificate.map((certificate, index) => (
              <tr key={certificate.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{index + 1}</td>
                <td>{certificate.certificate ? certificate.certificate : 'No certificate available'}</td>
                <td>{certificate.description}</td>
                <td>{certificate.issuedby}</td>
                <td>
              <button onClick={() => handlEdit(certificate.id)} className="btn btn-primary me-2">
                    <i className="fas fa-edit" aria-hidden="true"></i> Edit
                  </button>
                    <button onClick={() => handleDeleteCertificate(certificate.id)} className="btn btn-danger">
                    <i className="fa fa-trash" aria-hidden="true"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
 
   
   
  );
  
  
};

export default ViewCertificate;

