import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';

const EditFeature = () => {
  const id = localStorage.getItem('items');
  const [updatedfeature, setUpdatedfeature] = useState({ features: '' });
  const token = sessionStorage.getItem('tokenn')

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetFeatureById/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUpdatedfeature(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching feature:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedfeature(prevFeature => ({
      ...prevFeature,
      [name]: value,
    }));
  };



const handleSubmit = (e) => {
  e.preventDefault();
  const featureId = id;

  fetch(`${API_URL}/api/v2/editFeature/${featureId}`, {
    method: 'PATCH',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedfeature),
  })
  .then((response) => {
    if (response.ok) {
      console.log('Feature updated successfully');
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Feature details successfully updated',
      });
    } else {
      console.log('Error updating feature');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating feature',
      });
    }
  })
  .catch((error) => {
    console.log('Error updating feature:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating the feature',
    });
  });
};


  if (!updatedfeature) {
    return <div>Loading...</div>;
  }

  return (
   
    <div className='container2 mt-20'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to="/admin/PlanFeatures">Features</Link>
          </li>
          <li className="breadcrumb-item active text-white">Edit</li>
        </ol>
        <div className="row">
     
         
                <form onSubmit={handleSubmit}>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Feature</th>
                        <td>
                          <input
                            type="text"
                            name="features"
                            value={updatedfeature.features}
                            onChange={handleChange}
                            className="form-control"
                          />
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
          // </div>
      //   </div>
      // </div>
  );
};

export default EditFeature;