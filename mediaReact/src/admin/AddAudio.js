import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
// import '../csstemp/addAudio.css';
import API_URL from '../Config';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";

const AddAudio = () => {
  //.....................................Admin Function............................................
 
  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoryId, setCategoryId] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(`${API_URL}/api/v2/GetAllCategories`);
        setCategories(categoriesResponse.data);
        console.log(categories)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const generateAudioTitle = () => {
    const fileName = audioFile ? audioFile.name : 'Untitled Audio';
    return fileName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      const audioData = {
        category: categoryId,
        audioFile: audioFile,
        thumbnail: thumbnail,
      };
      console.log(audioData)
  
      // Append each property in the audioData object to FormData
      for (const key in audioData) {
        formData.append(key, audioData[key]);
      }
  
      const response = await axios.post(`${API_URL}/api/v2/uploadaudio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data);
      console.log("audio updated successfully");
      // Handle success, e.g., show a success message to the user
    } catch (error) {
      console.error('Error uploading audio:', error);
      // Handle error, e.g., show an error message to the user
    }
    setCategoryId('')
    setAudioFile(null)
    setThumbnail(null)
  };

    const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!categoryName) {
      errors.categoryName = 'Category is required.';
      isValid = false;
    }

    if (!tagName) {
      errors.tagName = 'Tag is required.';
      isValid = false;
    }

    if (!audioFile) {
      errors.audioFile = 'Audio file is required.';
      isValid = false;
    }

    if (!thumbnail) {
      errors.thumbnail = 'Thumbnail is required.';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };
  
  return (
    <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem"}}>

 <Sidebar />
    <div className='container-fluid'>
    
     <div className='container2'>

          <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white"><Link to="/Dashboard">Dashboard</Link>
          </li>
            <li className="breadcrumb-item active">Add Audio</li>
          </ol>
      <div className='temp justify-content-center'>
        <div className='col-lg-12'>
          {/* {name=="admin"
          ? */}
         
            <div className='card-body'>
              <form className='form-container' onSubmit={handleSubmit}>
               
                <div className='modal-body text-center'>
                   <h5 className='modal-title modal-header' id='exampleModalLongTitle' style={{fontFamily:'Poppins'}}>
                    Select Category
                  </h5>
                <select
                  className='form-control'
                  name='category'
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                <option value=''>Select Category</option>
                    {categories.map((category) => (
                     <option key={category.id} value={category.id}>
                    {category.categories}
                </option>
                ))}
               </select>
                  {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
                  <br />
                  <br />
                  <h5 className='modal-title modal-header' id='exampleModalLongTitle' style={{fontFamily:'Poppins'}}>
                    Add New Audio File
                  </h5>
                  <input
                    type='file'
                    className='form-control'
                    placeholder='Choose Audio File'
                    name='audioFile'
                    onChange={(e) => setAudioFile(e.target.files[0])}
                  />
                  {errors.audioFile && <div className="error-message">{errors.audioFile}</div>}
                  <br />
                  <h5 className='modal-title modal-header' id='exampleModalLongTitle' style={{fontFamily:'Poppins'}}>
                    Add Thumbnail
                  </h5>
                  <input
                    type='file'
                    className='form-control'
                    placeholder='Choose Thumbnail'
                    name='thumbnail'
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                  {errors.thumbnail && <div className="error-message">{errors.thumbnail}</div>}
                  <br />
                </div>
                <div className='modal-footer'>
                  <input
                    type='submit'
                    name='but_upload'
                    value='Upload'
                    className='btn btn-info'
                  />
                </div>
              </form>
            </div>
          </div>
          {/* : */}
          {/* <div className='card shadow-lg border-0 rounded-lg mt-5'>
          <div className='card-header'>
            <h2 className='text-center'>Add User Audios</h2>
            <hr />
          </div>
          <div className='card-body'>
            <form className='form-container' onSubmit={handleSubmit_u}>
              <div className='modal-header bg-info'>
                <h5 className='modal-title' id='exampleModalLongTitle'>
                  Add New Audio
                </h5>
              </div>
              <div className='modal-body text-center'>
                <select
                  className='form-control'
                  name='categoryName'
                  value={categoryName_u}
                  onChange={(e) => setCategoryName_u(e.target.value)}
                >
                  <option value=''>Select Category</option>
                  {categories_u.map((category) => (
                    <option key={category.id} value={category.category_name}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
                {errors_u.categoryName_u && <div className="error-message">{errors_u.categoryName_u}</div>}
                <br />
                <select
                  className='form-control'
                  name='tagName'
                  value={tagName_u}
                  onChange={(e) => setTagName_u(e.target.value)}
                >
                  <option value=''>Select Tag</option>
                  {tags_u.map((tag) => (
                    <option key={tag.id} value={tag.tag_name}>
                      {tag.tag_name}
                    </option>
                  ))}
                </select>
                {errors_u.tagName_u && <div className="error-message">{errors_u.tagName_u}</div>}
                <br />
                <select
                  className='form-control'
                  name='userId'
                  value={userId_u}
                  onChange={(e) => setUserId_u(e.target.value)}
                >
                  <option value=''>Select User ID</option>
                  {users_u.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.id}
                    </option>
                  ))}
                </select>
                {errors_u.userId_u && <div className="error-message">{errors_u.userId_u}</div>}
                <br />
                <h5 className='modal-title modal-header bg-info' id='exampleModalLongTitle'>
                  Add New Audio File
                </h5>
                <input
                  type='file'
                  className='form-control'
                  placeholder='Choose Audio File'
                  name='audioFile'
                  onChange={(e) => setAudioFile_u(e.target.files[0])}
                />
                {errors_u.audioFile_u && <div className="error-message">{errors_u.audioFile_u}</div>}
                <br />
                <h5 className='modal-title modal-header bg-info' id='exampleModalLongTitle'>
                  Add Thumbnail
                </h5>
                <input
                  type='file'
                  className='form-control'
                  placeholder='Choose Thumbnail'
                  name='thumbnail'
                  onChange={(e) => setThumbnail_u(e.target.files[0])}
                />
                {errors_u.thumbnail_u && <div className="error-message">{errors_u.thumbnail_u}</div>}
                <br />
              </div>
              <div className='modal-footer'>
                <input
                  type='submit'
                  name='but_upload'
                  value='Upload'
                  className='btn btn-info'
                />
              </div>
            </form>
          </div>
        </div>} */}
          
        </div>
      </div>
    </div>
    </div>

  );
};

export default AddAudio;
