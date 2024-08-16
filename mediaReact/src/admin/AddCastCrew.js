import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../Config';

const AddCastCrew = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // To display image preview
  const [error, setError] = useState('');
  const token = sessionStorage.getItem("tokenn");

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type === 'image/png') {
      setError('');
      setImage(file);

      // Display image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Only PNG files are accepted.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);

      const response = await axios.post(`${API_URL}/api/v2/addcastandcrew`, formData, {
        headers: {
          Authorization: token, // Pass the token in the Authorization header
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      Swal.fire({
        title: 'Success!',
        text: 'Cast and crew uploaded successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setName('');
      setDescription('');
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
    <div className='container3 mt-20'>
      <ol className="breadcrumb mb-4 d-flex my-0">
        <li className="breadcrumb-item">
          <Link to="/admin/Viewcastandcrew">Cast and Crews</Link>
        </li>
        <li className="breadcrumb-item active text-white">Add Cast and Crew</li>
      </ol>

      <form onSubmit={handleSubmit} method="post">
        <div className="outer-container">
          <div className="table-container">
            <div className="row py-3 my-3 align-items-center w-100">
              <div className="col-md-3">
                <label className="custom-label">Name</label>
              </div>
              <div className="col-md-4">
                <input 
                  type="text" 
                  id="textbox" 
                  className="form-control border border-dark border-2" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="row py-3 my-3 align-items-center w-100">
              <div className="col-md-3">
                <label className="custom-label">Description</label>
              </div>
              <div className="col-md-4">
                <input 
                  type="text" 
                  id="textbox" 
                  className="form-control border border-dark border-2" 
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="row py-3 my-3 align-items-center w-100">
              <div className="col-md-3">
                <label className="custom-label">Picture</label>
              </div>
              <div className="col-md-2 w-100 h-100">
                <div
                  className="drag-drop-area border border-dark border-2  text-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* {imageUrl ? (
                    <img src={imageUrl} alt="Preview"  />
                  ) : (
                    <span>Drag and drop</span>
                  )} */}
                  {!imageUrl && <span>Drag and drop</span>}
                </div>
                <div className="col-md-4">
       <span style={{ whiteSpace: 'nowrap' }}>please choose png format only*</span>
     </div>
     <div className="col-md-3">
     <span style={{ whiteSpace: 'nowrap' }}>{error && <div className="text-danger">{error}</div>}</span>
     </div>
              </div>
              <div className="col-md-4 mt-3">
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="border border-dark border-2 mt-4 p-1 bg-silver ml-2"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  Choose File
                </button> 
              </div>
            </div>

            <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                >
                  Submit
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCastCrew;

