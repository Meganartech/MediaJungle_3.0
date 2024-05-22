import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';

const EditCategory = () => {
  const id = localStorage.getItem('items');
  const [updatedcategory, setUpdatedcategory] = useState({ categories: '' });

  useEffect(() => {
    fetch(`http://localhost:8080/api/v2/GetCategoryById/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUpdatedcategory(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching category:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedcategory(prevCategory => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryId = id;
    fetch(`http://localhost:8080/api/v2/editCategory/${categoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedcategory),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Category updated successfully');
          window.alert('category details successfully updated');
        } else {
          console.log('Error updating category');
        }
      })
      .catch((error) => {
        console.log('Error updating category:', error);
      });
  };

  if (!updatedcategory) {
    return <div>Loading...</div>;
  }

  return (
    <div id="content-wrapper" className="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>
      <Sidebar />
      <div className="container-fluid">
        <h1 className="mt-4 text-white">{updatedcategory.categories}'s Profile</h1>
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
                        <th>Category</th>
                        <td>
                          <input
                            type="text"
                            name="categories"
                            value={updatedcategory.categories}
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
  );
};

export default EditCategory;