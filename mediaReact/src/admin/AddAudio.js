import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../csstemp/addAudio.css';
import API_URL from '../Config';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const AddAudio = () => {
  //.....................................Admin Function............................................
 
  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoryId, setCategoryId] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [selected, setSelected] = useState(false); 
  const [getall, setgetall] = useState('')
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null); // To display image preview

  const [selectedOption, setSelectedOption] = useState('free');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

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

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllPlans`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setgetall(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handlePaidRadioHover = () => {
      if (!hasPaymentPlan()) {
        Swal.fire({
          title: 'Error!',
          text: 'You first need to add a payment plan to enable this option.',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Go to Add plan page',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/admin/Adminplan');
          } else if (result.isDismissed) {
            console.log('Cancel was clicked');
          }
        });
      }
    };
  

    const hasPaymentPlan = () => {
         return getall.length > 0;
        //return false;
    };


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
      formData.append('category', categoryId);
      formData.append('audioFile', audioFile);
      formData.append('thumbnail', thumbnail);
      formData.append('paid', selectedOption === 'paid' ? 1 : 0); // Set paid based on selectedOption

      const response = await axios.post(`${API_URL}/api/v2/uploadaudio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      console.log("Audio uploaded successfully");

      // Optionally, show a success message
      Swal.fire({
        title: 'Success!',
        text: 'Audio uploaded successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Reset form state
      setCategoryId('');
      setAudioFile(null);
      setThumbnail(null);
      setSelectedOption('free'); // Reset selected option to 'free'
      setErrors({}); // Clear any previous errors
    } catch (error) {
      console.error('Error uploading audio:', error);

      // Optionally, show an error message
      Swal.fire({
        title: 'Error!',
        text: 'There was an error uploading the audio.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
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

  const handleRadioClick = () => {
    setSelected(!selected); // Toggle the value of 'selected'
  };
  
  return (
    
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
                  <h5 className='modal-title modal-header' style={{ fontFamily: 'Poppins' }}>
                      Choose Pricing Option
                  </h5>
                  <div className='temp'>
    <div className='col-lg-1'>
        <label>
            <input
                type="radio"
                value="free"
                checked={selectedOption === 'free'}
                onChange={handleRadioChange}
            />
            Free
        </label>
    </div>
    <div className='col-lg-1'>
        <label>
        <div
          className={`radio-button${selectedOption === 'paid' ? ' selected' : ''}`}
          onMouseEnter={handlePaidRadioHover}
          onClick={() => {
              if (hasPaymentPlan()) {
                  setSelectedOption('paid');
              }
          }}
      >
            <input
                type="radio"
                value="paid"
                checked={selectedOption === 'paid'}
                disabled={!hasPaymentPlan()}
                onChange={() => {
                    if (hasPaymentPlan()) {
                        setSelectedOption('paid');
                    }
                }}
               
            />
            Paid
            </div>
        </label>
    </div>
</div>
                                    

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
                  {imageUrl && (
                    <div className="col-md-12 mt-4 text-center">
                      <img src={imageUrl} alt="Preview" className="img-fluid" style={{ width:'100px' , height:'100px' }} />
                    </div>
                  )}

                  <input
                    type='file'
                    className='form-control'
                    placeholder='Choose Thumbnail'
                    name='thumbnail'
                    onChange={handleImageChange}
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
          
          
        </div>
      </div>
    </div>
   

  );
};

export default AddAudio;
