import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import '../csstemp/addAudio.css';
import { useRef } from 'react';
import ReactPlayer from 'react-player';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../App.css";
import API_URL from '../Config';
import "../css/Sidebar.css";


const AddAudio = () => {
  //.....................................Admin Function............................................

  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoryId, setCategoryId] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileedited, setaudioFileedited] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailedited, setThumbnailedited] = useState(null);
  const [Banneredited, setBanneredited] = useState(null);
  const [Bannerthumbnail, setBannerthumbnail] = useState(null);
  const [selected, setSelected] = useState(false);
  const [getallplan, setgetallplan] = useState('')
  const [audiofilename, setaudiofilename] = useState('')
  const navigate = useNavigate();
  const [BannerimageUrl, setBannerimageUrl] = useState(null); // To display image preview
  const [ThumbnailimageUrl, setThumbnailimageUrl] = useState(null); // To display image preview
  const [Certificate, setCertificate] = useState([]);
  const [Certificateid, setCertificateid] = useState([]);
  const [Certificatename, setCertificatename] = useState([]);
  const [selectedOption, setSelectedOption] = useState('free');
  const [getalldata, setgetalldata] = useState([]);
  const audioId = localStorage.getItem('audioId');
  const mode = (audioId === 'null' || audioId === "") ? true : false;


  const token = sessionStorage.getItem("tokenn")



  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllPlans`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setgetallplan(data);
        // console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(`${API_URL}/api/v2/GetAllCategories`);
        setCategories(categoriesResponse.data);
        // console.log(categories)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllCertificate`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setCertificate(data);
      // console.log(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

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
        // console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (audioId) {
      const audiofilename = "";
    
      fetch(`${API_URL}/api/v2/getaudio/${audioId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setgetalldata(data);
          // Store the fetched data in state
          setaudiofilename(data.audio_file_name);
         
          // console.log(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

      fetch(`${API_URL}/api/v2/getaudiothumbnailsbyid/${audioId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {

          const base64Thumbnail = data.thumbnail;
          console.log("base64Thumbnail",base64Thumbnail)
          
          setThumbnail(base64Thumbnail);
          if (base64Thumbnail) {
            setThumbnailimageUrl(`data:image/jpeg;base64,${base64Thumbnail}`);
          } else {
            setThumbnailimageUrl(null);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

      fetch(`${API_URL}/api/v2/getbannerthumbnailsbyid/${audioId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {

          const base64Thumbnail = data;
          setBannerthumbnail(base64Thumbnail);
          if (base64Thumbnail) {
            setBannerimageUrl(`data:image/jpeg;base64,${base64Thumbnail}`);
          } else {
            setBannerimageUrl(null);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });


    }

  }, []); 

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
        // console.log(data);
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
        // console.log("data");
        // console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, []);


  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];

    setBannerthumbnail(file);
    setBanneredited(true);

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
    setThumbnailedited(true);

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
          // console.log('Cancel was clicked');
        }
      });
    }
  };


  const hasPaymentPlan = () => {
    return getallplan.length > 0;
    //return false;
  };




  const handleRadioClick = () => {
    setSelected(!selected); // Toggle the value of 'selected'
  };

  // ===================================================

  const prevStep = () => {

    currentStep == 1 ? setCurrentStep(currentStep) : setCurrentStep(currentStep - 1);
  };

  const nextStep = () => {
    currentStep == 4 ? setCurrentStep(currentStep) : setCurrentStep(currentStep + 1);
  };

  const [selectedCastAndCrew, setSelectedCastAndCrew] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(event.target.files[0])
    setaudioFileedited(true)
    // console.log('File selected:', file);
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      // console.log('Video URL:', audioUrl);
      setAudioUrl(audioUrl);
    }
  };

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

  const [Getall, setGetall] = useState('');



 



  const handleCheckboxChange = (option) => (e) => {
    const isChecked = e.target.checked;
    const id = (option.id); // Convert ID to number
    const name = (option.name);

    if (isChecked) {
      setcastandcrewlist((prevList) => [...prevList, id]);
      setcastandcrewlistName((prevList) => [...prevList, `${name},`]);
    } else {
      setcastandcrewlist((prevList) => prevList.filter((item) => item !== id));
      setcastandcrewlistName((prevList) => prevList.filter((item) => item !== `${name},`));

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
  const styles = {
    audiodropdownContainer: {
      width: "100%",
      position: "relative",
    },
    audiodropdownInput: {
      width: "100%",
      padding: "8px",
      boxSizing: "border-box",
    },
    audiodropdownList: {
      position: "absolute",
      top: "40px",
      left: "0",
      width: "100%",
      maxHeight: "150px", // Maximum height for scrollable dropdown
      overflowY: "auto", // Enable scrolling
      backgroundColor: "white",
      border: "1px solid #ccc",
      zIndex: 1,
      scrollbarColor: "#2b2a52",
    },
   
    audiodropdownItem: {
      padding: "8px",
      cursor: "pointer",
    },
  };


  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [options, setOptions] = useState([]); // State for options fetched from the API
  const [filteredOptions, setFilteredOptions] = useState([]); // State for filtered options
  const dropdownRefmoviename= useRef(null);



 // Fetch categories from API
 useEffect(() => {
  const fetchMovieNames = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v2/movename`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const MovieNames = data.map(item => item.movie_name); // Assuming item.categories contains the category names
      setOptions(MovieNames); // Set the full list of options
      setFilteredOptions(MovieNames); // Set the filtered options initially
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchMovieNames();
}, []); // Run once when component mounts

// Toggle dropdown visibility
const handleDropdownToggle = () => {
  setDropdownOpen(!dropdownOpen);
  const MovieNames = options;
  
  
  // Separate options that start with the value from those that contain it elsewhere
  if(Movie_name!=null){
  const startsWithValue = MovieNames.filter(optione =>
    optione.toLowerCase().startsWith(Movie_name.toLowerCase())  // Options that start with the input
  );
  setFilteredOptions(startsWithValue); 
  
}
  // console.log(Movie_name)
};

 // Handle input change to filter options
 const handleInputChange = (e) => {
  
  const value = e.target.value.toLowerCase();
  const value2=e.target.value;
  const MovieNames = options;


  // Separate options that start with the value from those that contain it elsewhere
  const startsWithValue = MovieNames.filter(option =>
    option.toLowerCase().startsWith(value)  // Options that start with the input
  );

  const containsValue = MovieNames.filter(option =>
    option.toLowerCase().includes(value) && !option.toLowerCase().startsWith(value)  // Options that contain but don't start with the input
  );

  // Combine the two lists, with starting matches first
  const filtered = [...startsWithValue, ...containsValue];
 
  setFilteredOptions(filtered); 
  setDropdownOpen(true);
  setMovie_name(value2);
  
};

const handleOptionClick = (option) => {
  setMovie_name(option);
  setDropdownOpen(false);
  const MovieNames = options;
  
  // Separate options that start with the value from those that contain it elsewhere
  const startsWithValue = MovieNames.filter(optione =>
    optione.toLowerCase().startsWith(option.toLowerCase())  // Options that start with the input
  );
  setFilteredOptions(startsWithValue); 
  
  
};

 // Close dropdown if clicked outside
 useEffect(() => {
  const handleClickOutsidemoviename = (event) => {
    if (dropdownRefmoviename.current && !dropdownRefmoviename.current.contains(event.target)) {
 
      setDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutsidemoviename);
  return () => {
    document.removeEventListener('mousedown', handleClickOutsidemoviename);
  };
}, []);






  const [Getallcateegory, setGetallcategory] = useState('');
  const [isOpencat, setIsOpencat] = useState(false);
  const [categorylist, setcategorylist] = useState([]);
  const [categorylistName, setcategorylistName] = useState([]);
  const [Getalltag, setGetalltag] = useState('');
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
    // console.log();
    const isChecked = e.target.checked;
    const id = (option.category_id);
    const name = (option.categories);// Convert ID to number

    if (isChecked) {
      setcategorylist((prevList) => [...prevList, id]);
      setcategorylistName((prevList) => [...prevList, `${name},`]);

      // console.log(name);
    } else {
      setcategorylist((prevList) => prevList.filter((item) => item !== id));
      setcategorylistName((prevList) => prevList.filter((item) => item !== `${name},`));
    }
  };




  const handleCheckboxChangetag = (option) => (e) => {
    const isChecked = e.target.checked;
    const id = option.tag_id; // ID is already a number
    const name = option.tag;

    if (isChecked) {
      settaglist((prevList) => [...prevList, id]);
      settaglistName((prevList) => [...prevList,`${name},`]);
    } else {
      settaglist((prevList) => prevList.filter((item) => item !== id));
      settaglistName((prevList) => prevList.filter((item) => item !== `${name},`));
    }
  };

  useEffect(() => {
    if (getalldata) {
      setaudio_title(getalldata.audioTitle); 
      setMovie_name(getalldata.movie_name);
      

      const selectedCertificate = Certificate.find(cert => cert.certificate === getalldata.certificate_name);
      // console.log(getalldata.certificate_name)
      // console.log(Certificate.certificate)
      // console.log("selectedCertificate"+selectedCertificate)
      
      if (selectedCertificate) {
        setCertificateid(selectedCertificate.id); // Set the ID for the select box
        setCertificate_name(selectedCertificate.certificate); // Set the name as well
      }


      // setCertificate_name(getalldata.certificate_name);
      setRating(getalldata.rating);
      setCertificate_no(getalldata.certificate_no);
      setaudio_Duration(getalldata.audio_Duration);
      setSelectedOption(getalldata.paid === false ? 'free' : 'paid');
      setProduction_Company(getalldata.production_company);
      setDescription(getalldata.description);
      const audioUrl1 = `${API_URL}/api/v2/${audiofilename}/file`;
      setAudioUrl(audioUrl1);
           if (getalldata && getalldata.category) {
               getalldata.category.forEach(category => {
          const id = (category.category_id);
          const name= (category.categories);// Convert ID to number
          setcategorylistName((prevList) => [...prevList, `${name},`]);
          setcategorylist((prevList) => [...prevList, id]);
        });
      } else {
        console.log('Category data is undefined or null');
      }
           if (getalldata && getalldata.tag) {
            getalldata.tag.forEach(tag => {
          const id = (tag.tag_id);
          const name= (tag.tag);// Convert ID to number
          settaglistName((prevList) => [...prevList, `${name},`]);
          settaglist((prevList) => [...prevList, id]);

        });
      } else {
        console.log('Tag data is undefined or null');
      }
      if (getalldata && getalldata.castandCrew) {
        getalldata.castandCrew.forEach(castandCrew => {
      const id = (castandCrew.id);
      const name= (castandCrew.name);// Convert ID to number
      setcastandcrewlistName((prevList) => [...prevList, `${name},`]);
      setcastandcrewlist((prevList) => [...prevList, id]);
    });
  } else {
    console.log('Tag data is undefined or null');
  }
    }
  }, [getalldata]); // Dependency on getalldata


  const save = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/v2/count`, {
        method: 'GET',
      });

      if (response.ok) {
        try {
          const AudioData = new FormData();
          (audioId === 'null' || audioId === "") ? AudioData.append('audio_id', null) : AudioData.append('audio_id', audioId);

          AudioData.append('audio_title', audio_title);
          AudioData.append('Movie_name', Movie_name);
          AudioData.append('Audio_Duration', Audio_Duration);
          AudioData.append('Certificate_no', Certificate_no);
          AudioData.append('Certificate_name', Certificate_name);
          AudioData.append('Rating', Rating);
          AudioData.append('paid', selectedOption === 'paid');
          AudioData.append('production_company', Production_Company);
          AudioData.append('Description', Description);
         thumbnailedited===null?AudioData.append('thumbnail', null):AudioData.append('thumbnail', thumbnail);
         Banneredited===null?AudioData.append('Bannerthumbnail', null):AudioData.append('Bannerthumbnail', Bannerthumbnail);
         audioFileedited===null?AudioData.append('audioFile', null):AudioData.append('audioFile', audioFile);
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
            console.log(key + " :", value);
          }
          const saveResponse = await axios.post(`${API_URL}/api/v2/${(audioId === 'null' || audioId === "")?'test':'update'}`, AudioData, {
            headers: {
              Authorization: token, // Pass the token in the Authorization header
              'Content-Type': 'multipart/form-data',
            },
          });
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
  useEffect(() => {
    // Define async function within useEffect to call async function `getbannermovie`
    const fetchBanner = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/moviename/getbanner/${Movie_name}`);
        const data = await response.json();
  
        console.log("bannerdata", data);
  
        if (data) {
          const imageResponse = await fetch(`${API_URL}/api/v2/getbannerimage/${data}/get`);
          const imgdata = await imageResponse.json();
          setBannerimageUrl(`data:image/png;base64,${imgdata.userbanneraudio}`);
          console.log("Converted File:", imgdata);
        } else {
          console.error("Error: Movie ID not found");
          setBannerimageUrl('');
        }
      } catch (error) {
        console.error("Error fetching banner image:", error);
        setBannerimageUrl('');
      }
    };

    if (Movie_name) {
      fetchBanner();
    }
  }, [Movie_name]); // Re-run when `Movie_name` changes


  
  



  return (

    <div className="marquee-container">
    <div className='AddArea'>
      {/* <button className='btn btn-custom' onClick={() => handleClick("/admin/addAudio")}>Add Audio</button> */}
    </div><br/>

    <div className='container3 mt-10'>
      <ol className="breadcrumb mb-4 d-flex my-0">
        <li className="breadcrumb-item"><Link to="/admin/ListAudio">Audios</Link></li>
        <li className="breadcrumb-item active text-white">{mode ? "Add Audio" : "Edit Audio"}</li>
      </ol>

      <div className="outer-container">
        <div className="table-container" style={{ height: '63vh' }} >
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
                      {/* <input
                        type='text'
                        name='Movie Name'
                        id='Movie Name'
                        required
                        className="form-control border border-dark border-2 input-width"
                        placeholder="Movie Name"
                        onChange={changeMovie_name}
                        value={Movie_name}
                      /> */}
                      <div className="dropdown-container" style={styles.audiodropdownContainer} ref={dropdownRefmoviename} >
                      <input
        type="text"
        value={Movie_name || ''}
        onClick={handleDropdownToggle} // Open the dropdown on input click
        onChange={(e) => handleInputChange(e)} // Update the state as the user types
    // onBlur={() => {
    //   if (Movie_name) {
    //     getbannermovie(Movie_name); // Call the function if Movie_name is set
    //   }
    // }}
        className="form-control border border-dark border-2 input-width col-lg-12"
        style={{ padding: '10px', cursor: 'pointer' }}
        placeholder="Select an option"
      />


                            {dropdownOpen && filteredOptions.length > 0 && (
        <div
          className=" col-lg-12 custom-scrollbar"
          // style={{ maxHeight: '150px', overflowY: 'auto', position: 'absolute', zIndex: 1, background: 'white', border: '1px solid #ccc' }}
          style={styles.audiodropdownList}
          // ref={dropdownRef}
        >
          {filteredOptions.map((option, idx) => (
            <div
              key={idx}
              className="dropdown-item col-lg-12"
              style={{ padding: '10px', cursor: 'pointer' }}
              onClick={() => handleOptionClick(option)} // Set value on option click
              // ref={dropdownRef}
            >
              {option}
            </div>
          ))}
        </div>
      )}
                             <br />
                           </div>
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
                           
                            disabled={!hasPaymentPlan()}
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
                           <label className={`form-check-label ${selectedOption === 'paid' ? ' selected' : ''}`}
                   htmlFor="Paid"
                   onMouseEnter={handlePaidRadioHover}
                            onClick={() => {
                                if (hasPaymentPlan()) {
                                  setSelectedOption('paid');
                                }
                            }}
                            >
                              Paid</label>
                          {/* <label className="form-check-label" htmlFor="free">Paid</label> */}
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
                              {Array.isArray(Getall) && Getall.find(option => option.id === id)?.name}  
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
                                value={option.tag}
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
                                value={option.categories}
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
                    <div className="label-width col-md-4" >
                      <label className="custom-label">Audio Thumbnail</label>
                    </div>
                    <div className="flex-grow-1 col-md-7">
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
                            height: '10rem',

                          }}
                        >
                          {!ThumbnailimageUrl && <span>Drag and drop</span>}
                        </div>
                        <br></br>

                      </div>
                      <div className="mt-2">
                        <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
                      </div>
                      <div className="mt-2">

                        <button

                          style={{
                            marginTop: '5px',
                            marginLeft: '0px !Important',
                          }}
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
                    </div>
                    <br></br>


                    {/* ----------------------------------------------------------------------------------------
        */}




                  </div>


                </div>


                {/* Second Instance */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="label-width col-md-4">
                      <label className="custom-label">User Banner</label>
                    </div>
                    <div className="flex-grow-1 col-md-7">
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
                            height: '10rem',

                          }}
                        >
                          {!BannerimageUrl && <span>Drag and drop</span>}
                        </div>

                      </div>
                      <div className="mt-2">
                        <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
                      </div>
                      <div className="mt-2">

                        <button

                          style={{
                            marginTop: '5px',
                            marginLeft: '0px !Important',
                          }}
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
                    </div>
                  </div>
                </div>
              </div>


              <div className="row py-3 align-items-center w-100 ">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="label-width col-md-4" >
                      <label className="custom-label">Original Audio</label>
                    </div>
                    <div className="flex-grow-1 col-md-7">
                      <div className="d-flex align-items-center">
                        <div

                        >

                          <ReactPlayer
                            // `http://localhost:8080/api/v2/1725080679905_file_example_MP3_1MG.mp3/file`
                            url={audioUrl} // Example URL, replace it with your video URL
                            // playing={true}
                            controls={true}
                            width="280px"
                            height="40px"
                            config={{
                              file: {
                                attributes: {
                                  controlsList: 'nodownload'
                                }
                              }
                            }}
                          />
                        </div>
                        <br></br>

                      </div>
                      <div className="mt-2">
                        <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
                      </div>
                      <div className="mt-2">

                        <button
                          style={{
                            marginTop: '5px',
                            marginLeft: '0px !Important',
                          }}
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
                    </div>

                    {/* ----------------------------------------------------------------------------------------
        */}

                  </div>


                </div>

              </div>


            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="row p-2  align-items-center w-100">
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <div className='text-black'>Movie Name : {Movie_name}</div>

                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <div style={{
                          position: 'relative',
                          width: '500px',
                          height: '300px',
                          backgroundImage: `url(${ThumbnailimageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}>

                          <ReactPlayer
                            // `http://localhost:8080/api/v2/1725080679905_file_example_MP3_1MG.mp3/file`
                            url={audioUrl} // Example URL, replace it with your video URL
                            // playing={true}
                            controls={true}
                            width="100%"
                            height="100%"
                            config={{
                              file: {
                                attributes: {
                                  controlsList: 'nodownload'
                                }
                              }
                            }}
                          />

                        </div>


                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6" style={{ height: '390px' }}>

                  <div className="details-box ml-4 p-3 border border-dark border-2">

                    {/* <div class="row"> */}
                    <div class="col-md-12">
                      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        <table className="table table-bordered" style={{ width: '400px', border: 'none' }}>
                          <tbody>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Audio Title </td>
                              <td style={{ border: 'none' }}>{audio_title}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Audio Duration</td>
                              <td style={{ border: 'none' }}>{Audio_Duration}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Cast and Crew</td>
                              <td style={{ border: 'none' }}>{castandcrewlistName}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Certificate No</td>
                              <td style={{ border: 'none' }}>{Certificate_no}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Certificate Name</td>
                              <td style={{ border: 'none' }}>{Certificate_name}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Audio Access Type</td>
                              <td style={{ border: 'none' }}>{selectedOption}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Category</td>
                              <td style={{ border: 'none' }}>{categorylistName}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Tag</td>
                              <td style={{ border: 'none' }}>{taglistName}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Production Company</td>
                              <td style={{ border: 'none' }}>{Production_Company}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Description</td>
                              <td style={{ border: 'none' }}>{Description}</td>
                            </tr>
                            <tr style={{ border: 'none' }}>
                              <td style={{ border: 'none' }}>Rating</td>
                              <td style={{ border: 'none' }}>{Rating}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    </div>

                  </div>
                </div>

              </div>




            </>
          )}


        </div>
        <div className="row py-1 my-1 w-100">
          <div className="col-md-8 ms-auto text-end">
            {currentStep <= 3 ? <>
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
              </button></> : <>
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
            </>}

          </div>
        </div>
      </div>
    </div>
</div>

  );
};

export default AddAudio;


