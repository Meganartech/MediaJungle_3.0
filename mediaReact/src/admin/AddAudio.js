import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../csstemp/addAudio.css';
import API_URL from '../Config';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../App.css"
import { useRef } from 'react';


const AddAudio = () => {
  //.....................................Admin Function............................................
 
  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoryId, setCategoryId] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [Bannerthumbnail, setBannerthumbnail] = useState(null);
  const [selected, setSelected] = useState(false); 
  const [getall, setgetall] = useState('')
  const navigate = useNavigate();
  const [BannerimageUrl, setBannerimageUrl] = useState(null); // To display image preview
  const [ThumbnailimageUrl, setThumbnailimageUrl] = useState(null); // To display image preview
  const [Certificate, setCertificate] = useState([]);
  const [Certificateid, setCertificateid] = useState([]);
  const [Certificatename, setCertificatename] = useState([]);
  const [selectedOption, setSelectedOption] = useState('free');
  const [getalldata, setgetalldata] = useState([]);

  const token = sessionStorage.getItem("tokenn")


  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
 
    setBannerthumbnail(file);

    // Display image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerimageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerimageUrl(null);
    }
  };
  const handleThumbnailimageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    // Display image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailimageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailimageUrl(null);
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
           Authorization: token, // Pass the token in the Authorization header
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

  // ===================================================

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const [selectedCastAndCrew, setSelectedCastAndCrew] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const castAndCrewOptions = [
    { id: 1, name: 'Actor 1' },
    { id: 2, name: 'Actor 2' },
    { id: 3, name: 'Actor 3' },
    { id: 4, name: 'Director 1' },
    { id: 5, name: 'Director 2' },
    // Add more options as needed
  ];
  // const handleFile = (file) => {
  //   if (file && file.type === 'image/png') {
  //     setError('');
  //     setImage(file);
  
  //     // Display image preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageUrl(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setError('Only PNG files are accepted.');
  //   }
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   handleFile(file);
  // };

  // const handleDragOver = (event) => {
  //   event.preventDefault();
  // };

  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   const file = event.dataTransfer.files[0];
  //   // handleFile(file);
  // };
  
const handleVideoFileChange = (event) => {
  const file = event.target.files[0];
  setAudioFile(event.target.files[0])
  console.log('File selected:', file);
  if (file) {
    const audioUrl = URL.createObjectURL(file);
    console.log('Video URL:', audioUrl);
    setAudioUrl(audioUrl);
  }
};

// const handleVideoDrop = (event) => {
//   event.preventDefault();
//   const file = event.dataTransfer.files[0];
//   if (file) {
//     const videoUrl = URL.createObjectURL(file);
//     setVideoUrl(videoUrl);
//   }
// };
const handleSelectChange = (event) => {
  const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
  setSelectedCastAndCrew(selectedOptions);
};

const [audio_title, setaudio_title] = useState('');
const changeaudio_title = (event) => {
  const newValue = event.target.value;
  setaudio_title(newValue); // Updating the state using the setter function
};
const [Audio_Duration, setaudio_Duration] = useState('');
const changeaudio_Duration = (event) => {
  const newValue = event.target.value;
  setaudio_Duration(newValue); // Updating the state using the setter function
};
const [Movie_name, setMovie_name] = useState('');
  const changeMovie_name = (event) => {
    const newValue = event.target.value;
    setMovie_name(newValue); // Updating the state using the setter function
  };
const [Certificate_name, setCertificate_name] = useState('');
const changeCertificate_name = (event) => {
  const newValue = event.target.value;
  setCertificate_name(newValue); // Updating the state using the setter function
};
const [Rating, setRating] = useState('');
const changeRating = (event) => {
  const newValue = event.target.value;
  setRating(newValue); // Updating the state using the setter function
};
const [Certificate_no, setCertificate_no] = useState('');
const changeCertificate_no = (event) => {
  const newValue = event.target.value;
  setCertificate_no(newValue); // Updating the state using the setter function
};

const [isOpenCast, setisOpenCast] = useState(false);
const toggleDropdown = () => {
  setisOpenCast(!isOpenCast);
};
const [castandcrewlist, setcastandcrewlist] = useState([]);
const [castandcrewlistName, setcastandcrewlistName] = useState([]);

const [Getall,setGetall] = useState('');



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
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/v2/getaudio`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setgetalldata(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // _______________________________________set all values______________________________________________________

    // useEffect(() => {

    //   console.log(getalldata.audioTitle)
    //   setaudio_title(getalldata.audioTitle);



    // }, []);
  // useEffect(() => {
  //   if (getalldata) {
  //     setaudio_title(getalldata.audioTitle); // Update the audio_title state with the value from getalldata
  //     setMovie_name(getalldata.movie_name);
  //     setCertificate_name(getalldata.certificate_name);
  //     setRating(getalldata.rating); 
  //     setCertificate_no(getalldata.certificate_no); 
  //     setaudio_Duration(getalldata.audio_Duration);
  //     setSelectedOption(getalldata.paid="false"?'free':'paid');
  //     setProduction_Company(getalldata.production_company);
  //     setDescription(getalldata.description); 
  //     handleCheckboxChangecategory(getalldata.category);


  //   }
  // }, [getalldata]); // Dependency on getalldata


const handleCheckboxChange = (option) => (e) => {
    const isChecked = e.target.checked;
    const id = (option.id); // Convert ID to number
    const name = (option.name);
  
    if (isChecked) {
      setcastandcrewlist((prevList) => [...prevList, id]);
      setcastandcrewlistName((prevList) => [...prevList, `${name},`]);
    } else {
      setcastandcrewlist((prevList) => prevList.filter((item) => item !== id));
     
    }


  };
  const dropdownRef = useRef(null);
  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setisOpenCast(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [Production_Company, setProduction_Company] = useState('');
  const changeProduction_Company = (event) => {
    const newValue = event.target.value;
    setProduction_Company(newValue); // Updating the state using the setter function
  };
  const [Description, setDescription] = useState('');
  const changeDescription = (event) => {
    const newValue = event.target.value;
    setDescription(newValue); // Updating the state using the setter function
  };


  const [Getallcateegory,setGetallcategory] = useState('');
  const [isOpencat, setIsOpencat] = useState(false);
  const [categorylist, setcategorylist] = useState([]);
  const [categorylistName, setcategorylistName] = useState([]);
  const [Getalltag,setGetalltag] = useState('');
  const [isOpentag, setIsOpentag] = useState(false);
  const [taglist, settaglist] = useState([]);
  const [taglistName, settaglistName] = useState([]);
  
  const dropdownRefcat = useRef(null);
  const dropdownReftag = useRef(null);


  const handleClickOutsidetag = event => {
    if (dropdownReftag.current && !dropdownReftag.current.contains(event.target)) {
      setIsOpentag(false);
    }
  };
  
  const handleClickOutsidecat = event => {
    if (dropdownRefcat.current && !dropdownRefcat.current.contains(event.target)) {
      setIsOpencat(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsidecat);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsidecat);
    };
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsidetag);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsidetag);
    };
  }, []);

  const toggleDropdowncat = () => {
    setIsOpencat(!isOpencat);
  };
  const toggleDropdowntag = () => {
    setIsOpentag(!isOpentag);
  };
  const handleCheckboxChangecategory = (option) => (e) => {
    console.log();
    const isChecked = e.target.checked;
    const id = (option.category_id);
    const name= (option.categories);// Convert ID to number
  
    if (isChecked) {
      setcategorylist((prevList) => [...prevList, id]);
      setcategorylistName((prevList) => [...prevList, `${name},`]);

      console.log(name);
    } else {
      setcategorylist((prevList) => prevList.filter((item) => item !== id));
    }
  };


  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllCategories`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetallcategory(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      fetch(`${API_URL}/api/v2/GetAllTag`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

        setGetalltag(data);
        console.log("data");
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      fetch(`${API_URL}/api/v2/GetAllCertificate`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCertificate(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    }, []);

    const handleCheckboxChangetag = (option) => (e) => {
      const isChecked = e.target.checked;
      const id = (option.tag_id); // Convert ID to number
      const name = (option.tag);
      if (isChecked) {
        settaglist((prevList) => [...prevList, id]);
        settaglistName((prevList) => [...prevList, `${name},`]);
      } else {
        settaglist((prevList) => prevList.filter((item) => item !== id));
      }
    };
  const save = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch(`${API_URL}/api/v2/count`, {
            method: 'GET',
        });

        if (response.ok) {
            try {
                const AudioData = new FormData();
                AudioData.append('audio_title', audio_title);
                AudioData.append('Movie_name', Movie_name);
                AudioData.append('Audio_Duration', Audio_Duration);
                AudioData.append('Certificate_no', Certificate_no);
                AudioData.append('Certificate_name', Certificate_name);
                AudioData.append('Rating', Rating);
                AudioData.append('paid', selectedOption === 'paid');
                AudioData.append('production_company', Production_Company);
                AudioData.append('Description', Description);
                AudioData.append('thumbnail', thumbnail);
                AudioData.append('Bannerthumbnail', Bannerthumbnail);
                AudioData.append('audioFile', audioFile);
                castandcrewlist.forEach((id) => {
                AudioData.append('castAndCrewIds', id);
              });

              categorylist.forEach((id) => {
                AudioData.append('category', id);
            });
            taglist.forEach((id) => {
              AudioData.append('tag', id);
          });

                for (let [key, value] of AudioData.entries()) {
                  console.log(key+" :", value);
              }
                
                // Upload video description
                const saveResponse = await axios.post(`${API_URL}/api/v2/test`, AudioData,{
                  headers: {
                    Authorization: token, // Pass the token in the Authorization header
                   'Content-Type': 'multipart/form-data',
                 },
                    // onUploadProgress: (progressEvent) => {
                    //     const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    //     setUploadProgress(progress);
                    // }
                });
                

                // const videoId = uploadResponse.data.id; // Assuming the response contains the video ID

                // // Prepare data for the second API call
                // const castAndCrewData = new FormData();
                // castAndCrewData.append('videoId', videoId);
                // castandcrewlist.forEach((id) => {
                //     castAndCrewData.append('castAndCrewIds', id);
                // });


                // Save cast and crew
                // const saveResponse = await axios.post(`${API_URL}/api/v2/save`, castAndCrewData);
                if (saveResponse.status === 200) {
                  
                    Swal.fire({
                        title: 'Success!',
                        text: 'Audio and cast/crew data saved successfully',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error saving cast and crew data',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Error uploading video',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            Swal.fire({
                title: 'Limit Reached',
                text: 'The upload limit has been reached',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'An error occurred',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};
function mapIdsToNames(castandcrewlist, GetAllCategory) {
  return castandcrewlist.map(id => {
    const category = GetAllCategory.find(item => item.id === id);
    return category ? category.name : 'Unknown';
  });
}
  // Use the function to get the names
  const nameList = mapIdsToNames(castandcrewlist, Getall);



  return (
    
    
    
<div className='container3 mt-20'>
  <ol className="breadcrumb mb-4 d-flex my-0">
    <li className="breadcrumb-item"><Link to="/admin/Video">Audios</Link></li>
    <li className="breadcrumb-item active text-white">Add Audio</li>
  </ol>
  
  <div className="outer-container">
    <div className="table-container">
    {currentStep === 1 && (
            <>
      <div className="row py-3 my-3 align-items-center w-100">

        {/* Video Title */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            {/* <div className="flex-shrink-0 me-2"> */}
            <div className="label-width">
              <label className="custom-label">Audio Title</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='Audio Title'
                id='name'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Audio Title" 
                onChange={changeaudio_title}
                value={audio_title}
              />
            </div>
          </div>
        </div>

        {/* Age */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            {/* <div className="flex-shrink-0 me-2"> */}
            <div className="label-width">
              <label className="custom-label">Audio Duration</label>
            </div>
            <div className="flex-grow-1">
            <input 
                type='text'
                name='Audio Duration'
                id='name'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Main Audio Duration" 
                onChange={changeaudio_Duration}
                value={Audio_Duration}
              />
            </div>
          </div>
        </div>

      </div>

      <div className="row py-3 my-3 align-items-center w-100">

        {/* Trailer Duration */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Movie Name</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='Movie Name'
                id='Movie Name'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Movie Name" 
                onChange={changeMovie_name}
                value={Movie_name}
              />
            </div>
          </div>
        </div>


         {/* Certificate Name */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Certificate Name</label>
            </div>
            <div className="flex-grow-1">
              {/* <input 
                type='text'
                name='certificate_name'
                id='certificate_name'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Certificate Name" 
                onChange={changeCertificate_name}
                value={Certificate_name}
              /> */}
           
            {/* Certificate, setCertificate */}
            <select
             type='text'
             name='certificate_name'
             id='certificate_name'
             required
             className="form-control border border-dark border-2 input-width" 
             placeholder="Certificate Name" 
             value={Certificateid}
             value1={Certificatename}
            //  onChange={(e) => setCertificateid(e.target.value),(e) => setCertificatename(e.target.value1) }
             onChange={(e) => {
              const selectedIndex = e.target.options.selectedIndex;
              const certificateValue = e.target.value;
              const certificateName = e.target.options[selectedIndex].text;
              
              setCertificateid(certificateValue);
              setCertificate_name(certificateName);
            }}
                >
                <option value="">Select Certificate</option>
  {Certificate.map((certificate) => (
    <option key={certificate.id} value={certificate.id}>
      {certificate.certificate}
    </option>
  ))}
               </select>
               </div>
          </div>
        </div>

      </div>

      <div className="row py-3 my-3 align-items-center w-100">

        {/* Rating */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Rating</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='rating'
                id='rating'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="/10" 
                onChange={changeRating}
                value={Rating}
              />
            </div>
          </div>
        </div>

      
          {/* Certificate No */}
          <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Certificate No</label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='certificate_no'
                id='certificate_no'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Certificate No" 
                onChange={changeCertificate_no}
                value={Certificate_no}
              />
            </div>
          </div>
        </div>
        

      </div>


      <div className="row py-3 my-3 align-items-center w-100">

        {/* Subscription Type */}
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Audio access Type</label>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex">
                <div className="form-check form-check-inline">
                  {/* <input 
                    className="form-check-input"
                    type="radio"
                    name="subscriptionType"
                    id="paid"
                    value="Paid"
                    checked={selectedOption === 'paid'}
                    disabled={!hasPaymentPlan()}
                    onChange={() => {
                        if (hasPaymentPlan()) {
                            setSelectedOption('paid');
                        }
                    }}
                  /> */}
                   <input
                type="radio"
                value="free"
                checked={selectedOption === 'free'}
                onChange={handleRadioChange}
            />

                  <label className="form-check-label" htmlFor="paid">Free</label>
                </div>
                <div className="form-check form-check-inline ms-3">
                <div
          className={`radio-button${selectedOption === 'paid' ? ' selected' : ''}`}
          onMouseEnter={handlePaidRadioHover}
          onClick={() => {
              if (hasPaymentPlan()) {
                  setSelectedOption('paid');
              }
          }}
      ></div>
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
                  <label className="form-check-label" htmlFor="free">Paid</label>
                </div>
              </div>
            </div>


            {/* ------------------------------------------------------------------------
             */}
  
          </div>
        </div>
            {/* Cast and Crew */}
            <div className="col-md-6">
          <div className="d-flex align-items-center" >
            <div className="label-width">
              <label className="custom-label">Cast and Crew</label>
            </div>
          
            <div className="dropdown flex-grow-1 dropdown-container" ref={dropdownRef}>

               <button
              type="button"
              name='Cast_and_Crew'
                id='Cast_and_Crew'
                required
              className="form-control border border-dark border-2 input-width" 
              onClick={toggleDropdown}
            >
              {castandcrewlist.length > 0 ? 'Selected' : 'Select Cast & Crew'}
            </button>
            {isOpenCast && (
              <div className="dropdown-menu show">
                {Getall.map(option => (
                  <div key={option.id} className="dropdown-item">
                    <input
                      type="checkbox"
                      value={option.name}
                      checked={castandcrewlist.includes(option.id)}
                      onChange={handleCheckboxChange(option)}
                    />
                    <label className="ml-2">{option.name}</label>
                  </div>
                ))}
              </div>
            )}
            </div>
            


  
          </div>
        </div>
        <div className="col-md-6">
          
            </div>
            <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Cast and Crew</label>
              {castandcrewlist.length > 0 && (
            <div className="selected-items">
              <label>Selected:</label>
              {castandcrewlist.map(id => (
                <div key={id}>
                  {Getall.find(option => option.id === id)?.name} {/* Display name based on ID */}
                </div>
              ))}
            </div>
          )}
            </div>
            </div>
            </div>


      </div>

      {/* <div className="row py-1 my-1 w-100">
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
                  onClick={nextStep}
                >
                  Next
                </button>
       
              </div>
            </div> */}
            </>
          )}

{currentStep === 2 && (
            <>
               <div className="row py-3 my-3 align-items-center w-100">
               <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Description </label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='Description'
                id='Description'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Description" 
                onChange={changeDescription}
                value={Description}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <div className="label-width">
              <label className="custom-label">Production Company </label>
            </div>
            <div className="flex-grow-1">
              <input 
                type='text'
                name='Production Company'
                id='Production Company'
                required
                className="form-control border border-dark border-2 input-width" 
                placeholder="Production Company" 
                onChange={changeProduction_Company}
                value={Production_Company}
              />
            </div>
          </div>
        </div>
    </div>
    <div className="row py-3 my-3 align-items-center w-100">

{/* Subscription Type */}
<div className="col-md-6">
  <div className="d-flex align-items-center">
    <div className="label-width">
      <label className="custom-label">Tag</label>
    </div>
    

    <div className="dropdown flex-grow-1 dropdown-container" ref={dropdownReftag}>
    <button
              type="button"
              name='Tag'
        id='Tag'
        required
              className="form-control border border-dark border-2 input-width"
              onClick={toggleDropdowntag}
            >
              {taglist.length > 0 ? 'Selected' : 'Select Tag'}
            </button>
            {isOpentag && (
              <div className="dropdown-menu show">
                {Getalltag.map(option => (
                  <div key={option.tag_id} className="dropdown-item">
                    <input
                      type="checkbox"
                      value={option.tag                     }
                      checked={taglist.includes(option.tag_id)}
                      onChange={handleCheckboxChangetag(option)}
                    />
                    <label className="ml-2">{option.tag}</label>
                  </div>
                ))}
              </div>
            )}
    </div>
  </div>
</div>
    {/* Cast and Crew */}
    <div className="col-md-6">
  <div className="d-flex align-items-center">
    <div className="label-width">
      <label className="custom-label">Category</label>
    </div>
    <div className="dropdown flex-grow-1 dropdown-container" ref={dropdownRefcat}>
    <button
              type="button"
              name='Category'
        id='Category'
        required
              className="form-control border border-dark border-2 input-width"
              onClick={toggleDropdowncat}
            >
              {categorylist.length > 0 ? 'Selected' : 'Select Category'}
            </button>
            {isOpencat && (
              <div className="dropdown-menu show">
                {Getallcateegory.map(option => (
                  <div key={option.category_id} className="dropdown-item">
                    <input
                      type="checkbox"
                      value={option.categories                      }
                      checked={categorylist.includes(option.category_id)}
                      onChange={handleCheckboxChangecategory(option)}
                    />
                    <label className="ml-2">{option.categories}</label>
                  </div>
                ))}
              </div>
            )}
            
    </div>
  </div>
</div>
<div className="col-md-6">
  <div className="d-flex align-items-center">
    <div className="label-width">
      <label className="custom-label">Tags</label>
      {taglist.length > 0 && (
            <div className="selected-items">
              <label>Selected:</label>
              {taglist.map(id => (
                <div key={id}>
                  {Getalltag.find(option => option.tag_id === id)?.tag} {/* Display name based on ID */}
                </div>
              ))}
            </div>
          )}
    </div>
    </div>
    </div>
    <div className="col-md-6">
  <div className="d-flex align-items-center">
    <div className="label-width">
      <label className="custom-label">Categories</label>
      {categorylist.length > 0 && (
            <div className="selected-items">
              <label>Selected:</label>
              {categorylist.map(id => (
                <div key={id}>
                  {Getallcateegory.find(option => option.category_id === id)?.categories} {/* Display name based on ID */}
                </div>
              ))}
            </div>
          )}
    </div>
    </div>
    </div>


</div>


  

   

 



            </>
          )}

{currentStep === 3 && (
  <>
    <div className="row py-3 my-3 align-items-center w-100">
    {/* First Instance */}
    <div className="col-md-6">
    <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">Audio Thumbnail</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                // onDrop={handleDrop}
                // onDragOver={handleDragOver}
                style={{
                  // backgroundVideo: imageUrl ? `url(${imageUrl})` : 'none',
                  // backgroundSize: 'cover',
                  // backgroundPosition: 'center'
                  backgroundImage: ThumbnailimageUrl ? `url(${ThumbnailimageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  
                }}
              >
                {!ThumbnailimageUrl && <span>Drag and drop</span>}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('Thumbnail').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="Thumbnail"
                style={{ display: 'none' }}
                // onChange={handleFileChange}
                onChange={handleThumbnailimageChange}
              />
            </div>
            <div className="mt-2">
              <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
            </div>
          </div>
          {/* ----------------------------------------------------------------------------------------
        */}



          
        </div>
      </div>


      {/* Second Instance */}
      <div className="col-md-6">
        <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">User Banner</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                // onDrop={handleDrop}
                // onDragOver={handleDragOver}
                style={{
                  // backgroundVideo: imageUrl ? `url(${imageUrl})` : 'none',
                  // backgroundSize: 'cover',
                  // backgroundPosition: 'center'
                  backgroundImage: BannerimageUrl ? `url(${BannerimageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  
                }}
              >
                {!BannerimageUrl && <span>Drag and drop</span>}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('Banner').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                id="Banner"
                style={{ display: 'none' }}
                // onChange={handleFileChange}
                onChange={handleBannerImageChange}
              />
            </div>
            <div className="mt-2">
              <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div className="row py-3 my-3 align-items-center w-100">
    {/* First Instance */}
    <div className="col-md-6">
    <div className="d-flex align-items-center">
          <div className="label-width">
            <label className="custom-label">Original Audio</label>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div
                className="drag-drop-area border border-dark border-2 text-center"
                // onDrop={handleVideoDrop}
                // onDragOver={handleDragOver}
                style={{
                  // backgroundVideo: videoUrl ? `url(${videoUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {audioUrl ? (
                <video
                  src={audioUrl}
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span>Drag and drop</span>
              )}
              </div>
              <button
                type="button"
                className="border border-dark border-2 p-1 bg-silver ml-2 choosefile"
                onClick={() => document.getElementById('fileInput1').click()}
              >
                Choose File
              </button>
              <input
                type="file"
                accept="audio/*"
                id="fileInput1"
                style={{ display: 'none' }}
                name='audioFile'
                onChange={handleVideoFileChange}
              />
            </div>
            <div className="mt-2">
              {/* <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span> */}
            </div>
          </div>
        </div>
      </div>

    </div>



{/* <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
              
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div> */}


  </>
)}

{currentStep === 4 && (
            <>
            <div className="preview-container d-flex justify-content-center align-items-center">
        <div className="d-flex">
          <div className="flex-grow-1">
            <div className='text-black'>Movie Name : {Movie_name}</div>
            <div
                className="drag-drop-area border border-dark border-2 text-center"
                // onDrop={handleDrop}
                // onDragOver={handleDragOver}
                style={{
                  // backgroundVideo: imageUrl ? `url(${imageUrl})` : 'none',
                  // backgroundSize: 'cover',
                  // backgroundPosition: 'center'
                  backgroundImage: ThumbnailimageUrl ? `url(${ThumbnailimageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  
                }}
              >
                </div>
            <div className="video-container mt-3">

              <video  controls>
                <source src={audioUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="details-box ml-4 p-3 border border-dark border-2">
          
          <div class="row">
            <div class="col-6">
              <div className='text-black'>Audio Title: -- :{audio_title}</div>
              <div className='text-black'>Audio Duration:-- :{Audio_Duration}</div>
              <div className='text-black'>Cast and Crew: {castandcrewlistName}</div>
              <div className='text-black'>Certificate No:  -- {Certificate_no}</div>
              <div className='text-black'>Certificate name:  -- {Certificate_name}</div>
              <div className='text-black'>Audio access type:   -- {selectedOption}</div>
              <div className='text-black'>Category:{categorylistName}</div>
              <div className='text-black'>Tag:{taglistName}</div>
              <div className='text-black'>Production Company:  -- {Production_Company}</div>
              <div className='text-black'>Description:   -- {Description}</div>
              <div className='text-black'>Rating:   --  {Rating}</div>
            </div>
            {/* <div class="col-6">
              <p>{audio_title}</p>
              <p>2hrs</p>
              <p>2mins</p>
              <p>Suriya, Tamana, Prabu</p>
              <p>91234467</p>
              <p>U/A</p>
              <p>{selectedOption}</p>
              <p>Action</p>
              <p>#aayan, #suriya, #tamana, #harris jeyaraj</p>
              <p>{Production_Company}</p>
              <p>{Description}</p>
              <p>{Rating}</p>
            </div> */}
          </div>
        </div>
      </div>
    
        </div>


  <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
            
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </button>
       
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  onClick={save}
                  
                >
                  Submit
                </button>
          
              </div>
            </div>       

        
   
  </>
)}


    </div>
    <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
              
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                  onClick={prevStep}
                >
                  Back
                </button>
               
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  onClick={nextStep}
                >
                  Next
                </button>
               
              </div>
            </div>
  </div>
</div>


  );
};

export default AddAudio;


