import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API_URL from '../Config';
import Swal from 'sweetalert2';

const Viewcastandcrew = () => {
  const [getall, setGetall] = useState([]);
  const [image,setimage] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllcastandcrew`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetall(data);
        console.log("image",image)
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDelete = (castId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_URL}/api/v2/Deletecastandcrew/${castId}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.status <= 205 ? {} : response.json();
          })
          .then(data => {
            if (data) {
              console.log('Cast and crew deleted successfully', data);
            } else {
              console.log('Cast and crew deleted successfully (no content)');
            }

            setGetall(prevCast => prevCast.filter(cast => cast.id !== castId));

            Swal.fire({
              title: 'Deleted!',
              text: 'Cast and crew have been deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          })
          .catch(error => {
            console.error('Error deleting cast and crew:', error);

            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the cast and crew.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your cast and crew are safe :)',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  const handlEdit = async (castId) => {
    localStorage.setItem('items', castId);
    navigate('/admin/Editcastandcrew');
  };

  return (
    <div className="container-fluid">
      <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Cast and crew</li>
        </ol>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>

          <div className="card-1 mb-4" style={{ height: "auto" }}>
            <div className="card-header">
              <i className="fas fa-table me-1"></i>
              Cast And Crew List
            </div>
            <div className="card-body profile-card-body">
              <table id="datatablesSimple">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getall && getall.length > 0 && (
                    getall.map((cast, index) => (
                      <tr key={cast.id}>
                        <td>{index + 1}</td>
                        <td>{cast.name}</td>
                        <td>
                          {cast.image && (
                            
                            <img src={`data:image/jpeg;base64,${cast.image}`} alt={cast.name} style={{ width: '50px', height: 'auto' }} />
                          )}
                        </td>
                        <td>
                          <button onClick={() => handlEdit(cast.id)}>
                            <i className="fas fa-edit" aria-hidden="true"></i>
                          </button>

                          <button onClick={() => handleDelete(cast.id)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Viewcastandcrew;
