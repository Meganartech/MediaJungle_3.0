import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useLocation , Link} from 'react-router-dom';
import "../css/Sidebar.css";

const EditLanguage = () => {

  const id=localStorage.getItem('items');
  const [updatedlanguage, setUpdatedlanguage] = useState({language:''});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedlanguage((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/v2/GetLanguageById/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUpdatedlanguage(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching language:', error);
      });
  }, [id]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const languageId = id;
      fetch(`http://localhost:8080/api/v2/editLanguage/${languageId}`, {  // Use backticks (`) for string interpolation
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedlanguage),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Language updated successfully');
            window.alert('Language details successfully updated');
          } else {
            console.log('Error updating language');
          }
        })
        .catch((error) => {
          console.log('Error updating language:', error);
        });
    
  };
  

  return (
    <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

   
      <Sidebar />
    <div className="container-fluid">
 

      <h1 className="mt-4 text-white">{updatedlanguage.language}'s Profile</h1>
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
                      <th>Language</th>
                      <td>
                        <input
                          type="text"
                          name="language"
                          value={updatedlanguage.language}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {errors.username && <div className="error">{errors.language}</div>}
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

export default EditLanguage;