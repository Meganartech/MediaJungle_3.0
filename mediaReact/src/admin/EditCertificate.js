import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';

const EditCertificate = () => {
  const id = localStorage.getItem('items');
  const [updatedcertificate, setUpdatedcertificate] = useState({ certificate: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedcertificate((prevCertificate) => ({
      ...prevCertificate,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/v2/GetCertificateById/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUpdatedcertificate(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching certificate:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const certificateId = id;
    fetch(`http://localhost:8080/api/v2/editCertificate/${certificateId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedcertificate),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Certificate updated successfully');
          window.alert('Certificate details successfully updated');
        } else {
          console.log('Error updating certificate');
        }
      })
      .catch((error) => {
        console.log('Error updating certificate:', error);
      });
  };

  if (!updatedcertificate) {
    return <div>Loading...</div>;
  }

  return (
    <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>
      <Sidebar />
      <div className="container-fluid">
        <h1 className="mt-4 text-white">{updatedcertificate.id} - {updatedcertificate.certificate}'s Profile</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Edit</li>
        </ol>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Certificate</th>
                        <td>
                          <input
                            type="text"
                            name="certificate"
                            value={updatedcertificate.certificate}
                            onChange={handleChange}
                            className="form-control"
                          />
                          {errors.certificate && <div className="error">{errors.certificate}</div>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button type="submit" className="btn btn-info">
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCertificate;