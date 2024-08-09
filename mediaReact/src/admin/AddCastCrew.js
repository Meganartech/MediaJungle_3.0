// import React, { useState } from 'react';
// import axios from 'axios';
// import Sidebar from './sidebar';
// import Navbar from './navbar';
// import { Link } from 'react-router-dom';
// import "../css/Sidebar.css";
// import Swal from 'sweetalert2';
// import API_URL from '../Config';

// const AddCastCrew = () => {
//   const [name, setName] = useState('');
//   const [image, setImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null); // To display image preview
//   const token = sessionStorage.getItem("tokenn")

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);

//     // Display image preview
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImageUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setImageUrl(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append('name', name);
//       formData.append('image', image);
//       const response = await axios.post(`${API_URL}/api/v2/addcastandcrew`, formData, {
//         headers: {
//           Authorization: token, // Pass the token in the Authorization header
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log(response.data);
//       console.log("cast and crew uploaded successfully");

//       Swal.fire({
//         title: 'Success!',
//         text: 'Cast and crew uploaded successfully.',
//         icon: 'success',
//         confirmButtonText: 'OK',
//       });

//       setName('');
//       setImage(null);
//       setImageUrl(null); 
//     } catch (error) {
//       console.error('Error uploading cast and crew:', error);

//       Swal.fire({
//         title: 'Error!',
//         text: 'There was an error uploading the cast and crew.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//     }
//   };

//   return (
//     <div className='container2 mt-20'>
//         <ol className="breadcrumb mb-4">
//           <li className="breadcrumb-item">
//             <Link to="/admin/Viewcastandcrew">Cast and Crews</Link>
//           </li>
//           <li className="breadcrumb-item active  text-white">Add Cast and Crew</li>
//         </ol>

//         <form onSubmit={handleSubmit} method="post" className="registration-form">
//           <div className="temp">
//             <div className="col-md-6">
//               <div className="form-group">
//                 <label className="custom-label">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="form-control"
//                 />
//               </div>
//             </div>
//           </div>
           
//          {imageUrl && (
//           <div className="col-md-12 mt-4 text-center">
//             <img src={imageUrl} alt="Preview" className="img-fluid" style={{ width:'100px' , height:'100px' }} />
//           </div>
//         )}
//           <div className="temp">
//             <div className="col-md-12">
//               <div className="form-group">
//                 <label className="custom-label">Upload Image</label>
//                 <input
//                   type="file"
//                   name="image"
//                   onChange={handleImageChange} 
//                   className="form-control"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="temp">
//             <div className="col-md-12 text-center">
//               <input type="submit" className="btn btn-info" name="submit" value="Add" />
//             </div>
//           </div>
//         </form>

      
//       </div>
      
   
//   );
// };

// export default AddCastCrew;





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
  const token = sessionStorage.getItem("tokenn")

  const [error, setError] = useState('');

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type === 'image/png') {
      setError('');
      // Handle the file upload
      console.log('File accepted:', file);
    } else {
      setError('Only PNG files are accepted.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Handle file selection
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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
          Authorization: token, // Pass the token in the Authorization header
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
<div className='container2 mt-20'>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin/Viewcastandcrew">Cast and Crews</Link>
        </li>
        <li className="breadcrumb-item active text-white">Add Cast and Crew</li>
      </ol>

      <form onSubmit={handleSubmit} method="post">
        <div className="container mt-3">
          <div className="row py-3 my-3 align-items-center">
            <div className="col-md-3">
              <label className="custom-label">Name</label>
            </div>
            <div className="col-md-4">
              <input 
                type="text" 
                id="textbox" 
                className="form-control border border-dark border-2" 
                placeholder="Enter your name" 
              />
            </div>
          </div>

          <div className="row py-3 my-3 align-items-center">
            <div className="col-md-3">
              <label className="custom-label">Description</label>
            </div>
            <div className="col-md-4">
              <input 
                type="text" 
                id="textbox" 
                className="form-control border border-dark border-2" 
                placeholder="Description" 
              />
            </div>
          </div>

          <div className="row py-3 my-3 align-items-center">
  <div className="col-md-3">
    <label className="custom-label">Picture</label>
  </div>
  <div className="col-md-2 w-50">
    <div
      className="upload-box text-center border border-dark border-2"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      Drag and drop
    </div>
    <div className="col-md-4">
      <span style={{ whiteSpace: 'nowrap' }}>please choose png format only*</span>
    </div>
    <input
      type="file"
      id="fileInput"
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
  </div>
  <div className="col-md-2">
    <input
      type="file"
      id="fileInput"
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
    <button
      type="button"
      className='border border-dark border-2 mt-4 p-1 bg-silver'
      onClick={() => document.getElementById('fileInput').click()}
    >
      Choose File
    </button> 
  </div>


             
            
    


            {error && <div className="text-danger mt-2">{error}</div>}
          </div>
        </div>
      </form>
    </div>
      );
};

export default AddCastCrew;

