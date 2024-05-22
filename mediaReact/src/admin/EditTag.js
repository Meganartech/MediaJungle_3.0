import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useLocation , Link} from 'react-router-dom';
import "../css/Sidebar.css";

const EditTag = () => {

  const id=localStorage.getItem('items');
  const [UpdatedTag, setUpdatedTag] = useState({tag:''});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTag((prevTag) => ({
      ...prevTag,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/v2/GetTagById/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUpdatedTag(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching tag:', error);
      });
  }, [id]);

  // useEffect(() => {
  //   console.log('Location State:', location.state); // Check the location state object
  //   if (location.state && location.state.tag) {
  //     setTagName(location.state.tag.tag_name);
  //   }
  // }, [location.state]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagId = id;
      fetch(`http://localhost:8080/api/v2/editTag/${tagId}`, {  // Use backticks (`) for string interpolation
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(UpdatedTag),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Tag updated successfully');
            window.alert('Tag details successfully updated');
          } else {
            console.log('Error updating Tag');
          }
        })
        .catch((error) => {
          console.log('Error updating tag:', error);
        });
    
  };
  
  // ...
  
  
  return (
    <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>
    <div className="container-fluid">
  
      <Sidebar />

    <div className="container-fluid">

      <h1 className="mt-4 text-white">{UpdatedTag.tag}'s Profile</h1>
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
                      <th>Tag</th>
                      <td>
                        <input
                          type="text"
                          name="tag"
                          value={UpdatedTag.tag}
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
        </div>
        
      </div>
    </div>
  </div>
</div>
  );
};

export default EditTag;