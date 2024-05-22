import React, { useState ,useEffect} from 'react';
import { Navbar } from 'react-bootstrap';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Sidebar.css";
import API_URL from '../Config';

const ViewCertificate= () => {
  const [certificate, setCertificate] = useState([]);
  const navigate = useNavigate();
  let Id;

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
    fetch(`${API_URL}/api/v2/DeleteCertificate/${certificateId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // If the response status is OK, don't attempt to parse JSON from an empty response
        return response.status === 204 ? null : response.json();
      })
      .then(data => {
        if (data) {
          console.log('Certificate deleted successfully', data);
        } else {
          console.log('Certificate deleted successfully (no content)');
        }
        // Remove the deleted category from the local state
        setCertificate(prevCertificate => prevCertificate.filter(certificate => certificate.id !== certificateId));
      })
      .catch(error => {
        console.error('Error deleting certificate:', error);
      });
  };

  const handlEdit = async (certificateId) => {
    localStorage.setItem('items', certificateId);
    navigate('/admin/EditCertificate');
  };
  
return (
  <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

   <Sidebar />
  <div className="container-fluid">
    <div className='container2'>
    <ol className="breadcrumb mb-4">
    <li className="breadcrumb-item text-white"><Link to="admin/Dashboard">Dashboard</Link>
    </li>
      <li className="breadcrumb-item active">View Certificate</li>
    </ol>
    
      <div className="card-body">
        <table id="datatablesSimple">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {certificate.map((certificate, index) => (
              <tr key={certificate.id}>
                <td>{index + 1}</td>
                <td>{certificate.certificate ? certificate.certificate : 'No certificate available'}</td>
                <td>
                {/* <button>
                <Link
                  to={{
                    pathname: `/admin/EditCertificate`,
                    state: { certificate },
                  }}
                >
                  <i className="fas fa-edit"></i>
                </Link> */}
              <button onClick={() => handlEdit(certificate.id)} >
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        
                  </button>
                    <button onClick={() => handleDeleteCertificate(certificate.id)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
   
  );
  
  
};

export default ViewCertificate;
