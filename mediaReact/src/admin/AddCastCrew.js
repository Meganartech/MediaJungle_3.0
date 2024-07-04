import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import Swal from 'sweetalert2';
import API_URL from '../Config';

const AddCastCrew = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // To display image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Display image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image);
      const response = await axios.post(`${API_URL}/api/v2/addcastandcrew`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      console.log("cast and crew uploaded successfully");

      Swal.fire({
        title: 'Success!',
        text: 'Cast and crew uploaded successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setName('');
      setImage(null);
      setImageUrl(null); 
    } catch (error) {
      console.error('Error uploading cast and crew:', error);

      Swal.fire({
        title: 'Error!',
        text: 'There was an error uploading the cast and crew.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Add Cast & Crew</li>
        </ol>

        <form onSubmit={handleSubmit} method="post" className="registration-form">
          <div className="temp">
            <div className="col-md-6">
              <div className="form-group">
                <label className="custom-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
             {/* Display image preview */}
         {imageUrl && (
          <div className="col-md-12 mt-4 text-center">
            <img src={imageUrl} alt="Preview" className="img-fluid" style={{ width:'100px' , height:'100px' }} />
          </div>
        )}
          <div className="temp">
            <div className="col-md-12">
              <div className="form-group">
                <label className="custom-label">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange} 
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="temp">
            <div className="col-md-12 text-center">
              <input type="submit" className="btn btn-info" name="submit" value="Add" />
            </div>
          </div>
        </form>

      
      </div>
    </div>
  );
};

export default AddCastCrew;
