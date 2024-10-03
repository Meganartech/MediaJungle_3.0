// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// // import '../App.css';
// import Navbar from './navbar';
// import Sidebar from './sidebar';
// import axios from 'axios';
// import Setting_sidebar from './Setting_sidebar';
// import Employee from './Employee'
// import "../css/Sidebar.css";
// import { Dropdown } from 'react-bootstrap';
// const Banner_setting= () => {

  
//     // ---------------------Admin functions -------------------------------
//   const [userIdToDelete, setUserIdToDelete] = useState('');
//   const [users, setUsers] = useState([]);
//   const name = sessionStorage.getItem('username');

 
   
 
//     //===========================================API--G================================================================
//   const [Google_Analytics, setGoogle_Analytics] = useState('');
//   const changeGoogle_AnalyticsHandler = (event) => {
//     const newValue = event.target.value;
//     setGoogle_Analytics(newValue); // Updating the state using the setter function from useState
//   };
//   const [Header_Scripts, setHeader_Scripts] = useState('');
//   const changeHeader_ScriptsHandler = (event) => {
//     const newValue = event.target.value;
//     setHeader_Scripts(newValue); // Updating the state using the setter function from useState
//   };
//   const [Body_Scripts, setBody_Scripts] = useState('');
//   const changeBody_ScriptsHandler = (event) => {
//     const newValue = event.target.value;
//     setBody_Scripts(newValue); // Updating the state using the setter function from useState
//   };
//   const save = (e) => {
//     e.preventDefault();
//     let SiteSetting = { google_analytics: Google_Analytics, header_scripts: Header_Scripts, body_scripts: Body_Scripts };
//     console.log("employee =>"+JSON.stringify(SiteSetting));
//     Employee.setMobilesettings(SiteSetting).then(res => {
//       setGoogle_Analytics('');
//       setHeader_Scripts('');
//       setBody_Scripts('');
//     })
//   }

//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedSetting, setSelectedSetting] = useState("Banner Settings"); // Default selected setting

//   const settingsOptions = [
//     { name: "Site Settings", path: "/admin/SiteSetting" },
//     { name: "Social Settings", path: "/admin/Social_setting" },
//     { name: "Payment Settings", path: "/admin/Payment_setting" },
//     { name: "Banner Settings", path: "/admin/Banner_setting" },
//     { name: "Footer Settings", path: "/admin/Footer_setting" },
//     { name: "Contact Settings", path: "/admin/Contact_setting" }
//   ];

//   const handleSettingChange = (setting) => {
//     setSelectedSetting(setting.name);
//     setIsOpen(false);
    
//   };
//   return (
//     <div className="marquee-container">
//     <div className='AddArea'>
//       {/* Dropdown for settings */}
//       <Dropdown 
//       show={isOpen} 
//       onToggle={() => setIsOpen(!isOpen)} // Toggle the dropdown
//     >
//       <Dropdown.Toggle
     
//         className={`${
//           isOpen ? 'bg-custom-color text-orange-600' : 'bg-custom-color'
//         } hover:bg-custom-color hover:text-orange-600`}
//       >
//         {selectedSetting}
//       </Dropdown.Toggle>

//       <Dropdown.Menu>
//         {settingsOptions.map((setting, index) => (
//           <Dropdown.Item
//             as={Link}
//             to={setting.path}
//             key={index}
//             onClick={() => handleSettingChange(setting)}
//           >
//             {setting.name}
//           </Dropdown.Item>
//         ))}
//       </Dropdown.Menu>
//     </Dropdown>
//     </div>
//     <br />
//     <div className='container2'>
//         <ol className="breadcrumb mb-4 d-flex my-0">
//           <li className="breadcrumb-item">
//             <Link to="/admin/SiteSetting">Settings</Link>
//           </li>
//           <li className="breadcrumb-item active  text-white">Banner Settings</li>
//         </ol>
//         <div className="table-container">           
//           <div className="card-body">
//           <div class="temp">
//           {/* <div class="col col-lg-2">
//         <Setting_sidebar />
//         </div> */}
//         <div class="col col-lg-9">
//         <ul className='breadcrumb-item' style={{paddingLeft: '0px'}}>
//         <form onSubmit="" method="post" className="registration-form">
//         <div className="temp">
//         <div className="col-md-6">
//         <div className="form-group">
//               <label className="custom-label">
//               Google Analytics
//                </label>
//                <input type="text" placeholder=" Google Analytics" name=" Google Analytics" value={Google_Analytics} onChange={changeGoogle_AnalyticsHandler} />
//               </div>
//           </div>
//           <div className="col-md-6">
//           <div className="form-group">
//               <label className="custom-label">
//               Header Scripts
//               </label>
//               <input type="text" placeholder=" Header Scripts" name="Header Scripts" value={Header_Scripts} onChange={changeHeader_ScriptsHandler} />
//              </div>
//           </div>
//           <div className="col-md-6">
//         <div className="form-group">
//               <label className="custom-label">
//               Body Scripts
//                 </label>
//                 <input type="text" placeholder="Body Scripts" name="Body Scripts" value={Body_Scripts} onChange={changeBody_ScriptsHandler} />
//              </div>
//           </div>
        
//           <div className="col-md-12">
         
//           <div className="form-group">
//           <input type="submit" className="btn btn-info" name="submit" value="Submit" onClick={save} />
            
//                </div>
//           </div>
//         </div>
//         </form>
//         </ul>
//         </div>
//         </div>
//         </div>
//         </div>
//       </div>
   
// </div>
//   );
// };

// export default Banner_setting;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import { Dropdown } from 'react-bootstrap';
import API_URL from '../Config';
import { useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Banner_setting= () => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("Banner Settings"); // Default selected setting
  const [activeView, setActiveView] = useState('movie');
  const token = sessionStorage.getItem("tokenn")

  const style = {
    videodropdownContainer: {
      width: "100%",
      position: "relative",
    },
    videodropdownInput: {
      width: "100%",
      padding: "8px",
      boxSizing: "border-box",
    },
    videodropdownList: {
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
   
    videodropdownItem: {
      padding: "8px",
      cursor: "pointer",
    },
  };

const [videotitle,setvideotitle] = useState([]);
const [videoContainer, setVideoContainer] = useState(0);  // Actual state used for audioTitle
const [videoinputValue, setVideoInputValue] = useState('');  // Internal input value
const [videotableData, setvideoTableData] = useState([]);  // Data for the table
const [videofilteredOptions, setvideoFilteredOptions] = useState([]);
const [videoinputValues, setvideoInputValues] = useState([]); // Track input values for each row
const [videodropdownStates, setvideoDropdownStates] = useState([]); // Track dropdown open/close states for each row
const [videocontainer, setvideocontainere] = useState('');  // Internal input value
const videodropdownRef = useRef(null); // Create a ref for the dropdown container
const [videoexistIndexvalue, setvideoExistIndexvalue] = useState([]);
const [videoexistingData, setvideoExistingData] = useState([]); // Create a ref for the dropdown container

  const settingsOptions = [
    { name: "Site Settings", path: "/admin/SiteSetting" },
    { name: "Social Settings", path: "/admin/Social_setting" },
    { name: "Payment Settings", path: "/admin/Payment_setting" },
    { name: "Banner Settings", path: "/admin/Banner_setting" },
    { name: "Footer Settings", path: "/admin/Footer_setting" },
    { name: "Contact Settings", path: "/admin/Contact_setting" },
    {name: "Container Settings", path: "/admin/container"}
  ];

  const handleSettingChange = (setting) => {
    setSelectedSetting(setting.name);
    setIsOpen(false);
    
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/v2/video/getall`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const videoNames = data.map(item => item.videoTitle);
        setvideotitle(data);
        setvideoFilteredOptions(videoNames); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    fetchbannerContainers();
  }, []);

  // console.log("videotitle",videotitle);

  const fetchbannerContainers = async () => {
    fetch(`${API_URL}/api/v2/getallvideobanners`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const categoryNames = data.map(item => item.categories);
        setvideocontainere(data);
        setVideoInputValue(data.length);
        setvideoTableData(data);
        setvideoExistingData(data);
        setVideoInputValue(data.length);
        setVideoContainer(data.length);
        setvideoDropdownStates(Array(data.length).fill(false)); // Initialize dropdown states
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    };

    // console.log("videocontainer",videocontainer);
    // console.log("videoinputvalue",videoinputValue);
    // console.log("table",videotableData);
    // console.log("existing",videoexistingData);
    // console.log("input",videoinputValue);
    // console.log("videocontainer",videoContainer);
    // console.log("drop",videodropdownStates);


    useEffect(() => {
      if (videocontainer.length && videotitle.length) {
        // Map through videocontainer and find matching video title using videoId and id
        const categoryNamesList = videocontainer.map(container => {
          const matchedVideo = videotitle.find(video => video.id === container.videoId); // Find matching video
          return matchedVideo ? matchedVideo.videoTitle : 'Unknown'; // Return the videoTitle if found, otherwise 'Unknown'
        });
    
        console.log("Category Names List:", categoryNamesList);
    
        // Store only the category names in state
        setvideoInputValues(categoryNamesList);
      }
    }, [videocontainer, videotitle]);
    
    // console.log("input values", videoinputValues);

    // Handle input change for filtering options
const handlevideoInputChanget = (e, index) => {
  const value = e.target.value.toLowerCase();  // Convert the input to lowercase
  const updatedInputValues = [...videoinputValues];
  updatedInputValues[index] = value;
  setvideoInputValues(updatedInputValues);
  
  const value2=e.target.value;
  const category = videotitle.find(cat => cat.videoTitle === value2);
  const data=category ? category.id : null;
  
  
  const updatedData = videotableData.map((row, i) => {
    if (i === index) {
      return { ...row, videoId: data };  // Dynamically update the field
    }
    return row;  // Return other rows unchanged
  });
  setvideoTableData(updatedData);
  
  const categoryNames = videotitle.map(item => item.videoTitle);
  // Separate options that start with the value from those that contain it elsewhere
  const startsWithValue = categoryNames.filter(option =>
    option.toLowerCase().startsWith(value)  // Options that start with the input
  );
  
  const containsValue = categoryNames.filter(option =>
    option.toLowerCase().includes(value) && !option.toLowerCase().startsWith(value)  // Options that contain but don't start with the input
  );
  
  // Combine the two lists, with starting matches first
  const filtered = [...startsWithValue, ...containsValue];
  
  setvideoFilteredOptions(filtered);  // Update the filtered options
  };
  


// Toggle dropdown for specific row
const handlevideoDropdownToggle = (index) => {
  setvideoExistIndexvalue(index)
  
  
  if(index==videoexistIndexvalue){
    const updatedDropdownStatesToFalse = videodropdownStates.map(() => false);
  setvideoDropdownStates(updatedDropdownStatesToFalse);
  setvideoExistIndexvalue(null)
  
  }else{
  setvideoDropdownStates(prevvideoDropdownStates => 
    prevvideoDropdownStates.map((state, i) => (i === index ? !state : false))
    
  );
  }
  
  };


  
  // Handle selecting an option
  const handlevideoOptionClick = (option, index) => {
  const updatedInputValues = [...videoinputValues];
  updatedInputValues[index] = option;
  setvideoInputValues(updatedInputValues);
  
  const updatedDropdownStates = [...videodropdownStates];
  updatedDropdownStates[index] = false;
  setvideoDropdownStates(updatedDropdownStates);
  const newValue = option;
  
  const category = videotitle.find(cat => cat.videoTitle === newValue);
  const data=category ? category.id : null;
  
  
  const updatedData = videotableData.map((row, i) => {
    if (i === index) {
      return { ...row, videoId: data };  // Dynamically update the field
    }
    return row;  // Return other rows unchanged
  });
  setvideoTableData(updatedData);
  const categoryNames = videotitle.map(item => item.videoTitle);
  setvideoFilteredOptions(categoryNames)
  
  };
  

  

  const handleSubmit = async () => {
    try {
        // Send the POST request using Axios
        const saveResponse = await axios.post(`${API_URL}/api/v2/addvideobanner`, videotableData, {
            headers: {
                Authorization: token, // Your token here
                'Content-Type': 'application/json',  // JSON content type
            },
        });

        if (saveResponse.status === 200) {
            Swal.fire({
                title: 'Success!',
                text: 'Videobanners  saved successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchbannerContainers();
                }
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Error saving Videobanners',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error uploading data:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Error uploading data',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};

  console.log(videotableData)


  const handleVideoUpdatecontainervalue = () => {
    const newValue = parseInt(videoinputValue, 10);
    
    if (videoinputValue === '') {
      alert('Please enter a valid number');
      return;
    }
    
    if (newValue <= videoContainer) {
      // Alert if the new value is less than the existing audioContainer
      alert('New value cannot be less than the existing value');
    
      // console.log(" new value  lesser than === audioContainer value")
      setVideoInputValue(videoContainer);
    } else {
      // Update audioContainer only if the new value is valid
      if (videoContainer <= 0) {
    
        // console.log("audio less than === 0")
        setVideoContainer(newValue);
        const rows = Array.from({ length:  videoinputValue }, (_, index) => ({
          videoId: ''
        }));
        setvideoTableData(rows);
        setVideoInputValue(newValue);
        setVideoContainer(newValue);
        setvideoDropdownStates(Array(newValue).fill(false)); // Initialize dropdown states
        setvideoInputValues(Array(newValue).fill("")); // Initialize input values
      }
      else if (videoContainer >= 0) {
    
        // console.log("audio greater than === 0")
        setvideoTableData((prevData) => {
          // Check if the current inputValue exceeds the existing rows in tableData
          if (newValue > prevData.length) {
            // Add new rows while keeping the existing ones intact
            const newRows = Array.from({ length: newValue - prevData.length }, () => ({
              videoId: ''
            }));
            return [...prevData, ...newRows]; // Combine old rows with new empty rows      
          }
          return prevData; // If inputValue is less than or equal, return existing data
        });
    
        setvideoDropdownStates((prevDropdownStates) => {
          // Check if inputValue exceeds the current length of dropdownStates
          if (newValue > prevDropdownStates.length) {
            // Add 'false' values to the end of dropdownStates
            const extraStates = Array(newValue - prevDropdownStates.length).fill(false);
            return [...prevDropdownStates, ...extraStates]; // Combine old states with new 'false' values
          }
          return prevDropdownStates; // If inputValue is less than or equal, return existing data
        });
        setvideoInputValues((prevInputValues) => {
          // Check if inputValue exceeds the current length of dropdownStates
          if (newValue > prevInputValues.length) {
            // Add 'false' values to the end of dropdownStates
            const extraValues = Array(newValue - prevInputValues.length).fill("");
            return [...prevInputValues, ...extraValues]; // Combine old states with new 'false' values
          }
          return prevInputValues; // If inputValue is less than or equal, return existing data
        });
    
        setVideoInputValue(newValue);
        setVideoContainer(newValue);
      }
    }
    };

    // Handle row deletion
const handleVideoDelete = async (index) => {
  // console.log('inside function')
  // console.log(tableData)
  if (index >= 0 && index < videotableData.length) {
    const data = videotableData[index];
    if(data.id!=null){
      try {
        const response = await axios.delete(`${API_URL}/api/v2/videobanner/${data.id}`, {
          headers: {
            Authorization: token, // Your token here
          }
        });
        // console.log(response.data); // AudioContainer deleted successfully
        Swal.fire({
          title: 'Deleted!',
          text: 'VideoContainer deleted successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // window.location.reload(); // Refresh page after deletion
          fetchbannerContainers();
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the VideoContainer',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
    else{
      Swal.fire({
        title: 'Deleted',
        text: 'VideoContainers and Categoryes  data deleted ',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  } 
  
  
  
  const updatedData = videotableData.filter((_, i) => i !== index);
  
  const updatedDropdownStates = videodropdownStates.filter((_, i) => i !== index);
  setvideoDropdownStates(updatedDropdownStates);
  
  // Delete the item at the specific index from inputValues
  const updatedInputValues = videoinputValues.filter((_, i) => i !== index);
  setvideoInputValues(updatedInputValues);
  
  setvideoTableData(updatedData);
  setVideoContainer(videoContainer - 1); // Reduce the count
  setVideoInputValue(updatedData.length);
  
  };
    




  return (
    <div className="marquee-container">
    <div className='AddArea'>
      {/* Dropdown for settings */}
      <Dropdown 
      show={isOpen} 
      onToggle={() => setIsOpen(!isOpen)} // Toggle the dropdown
    >
      <Dropdown.Toggle
     
        className={`${
          isOpen ? 'bg-custom-color text-orange-600' : 'bg-custom-color'
        } hover:bg-custom-color hover:text-orange-600`}
      >
        {selectedSetting}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {settingsOptions.map((setting, index) => (
          <Dropdown.Item
            as={Link}
            to={setting.path}
            key={index}
            onClick={() => handleSettingChange(setting)}
          >
            {setting.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
    </div>
    <br />
    <div className='container2'>
        <ol className="breadcrumb mb-4 d-flex my-0">
          <li className="breadcrumb-item">
            <Link to="/admin/SiteSetting">Settings</Link>
          </li>
          <li className="breadcrumb-item active  text-white">Banner Settings</li>
        </ol>
        <div className="outer-container">
      {activeView === 'movie' && (
        <>
          <div className="row py-3" style={{ paddingLeft: '50px', paddingRight: '70px', marginTop: '10px' }}>
            <div className="col-lg-2"></div>
            {/* <div className="col-lg-2 d-flex toggle" style={{ height: '50px', borderRadius: '55px' }}>
              <button
                className={`col-lg-6 custom-btn ${activeView === 'movie' ? 'active-btn' : 'inactive-btn'}`}
                onClick={() => handleViewChange('movie')}
                style={{ height: '35px' }}
              >
                Movie
              </button>
              <button
                className={`col-lg-6 custom-btn ${activeView === 'music' ? 'active-btn' : 'inactive-btn'}`}
                onClick={() => handleViewChange('music')}
              >
                Music
              </button> 
            </div> */}
            <div className="col-lg-3"></div>
            <div className="col-lg-2 custom-label" style={{ paddingTop: '6px', textAlign: 'right' }}>
              No of Containers
            </div>
            <div className="col-lg-3">
              <small className="text-muted d-block" style={{ marginTop: '-19px' }}>
                Max 20 containers only*
              </small>
              <input
                type="number"
                name="Audio Title Count"
                id="audioContainer"
                required
                className="form-control border border-dark border-2 input-width"
                placeholder="Enter Number of Containers"
                value={videoinputValue === 0 ? '' : videoinputValue}
                min="0"
                max="20"
                step="1"
                onChange={(e) => {
                  const value = e.target.value;
                    // Remove leading zeros
                    const sanitizedValue = value.replace(/^0+(?=\d)/, '');
                    // Allow only digits and empty value
                    if (/^\d*$/.test(sanitizedValue)) {
                      setVideoInputValue(sanitizedValue === '' ? 0 : sanitizedValue);
                    }
                  }}
              />
            </div>
            <div className="col-lg-1">
              <button className="btn btn-primary" 
              onClick={handleVideoUpdatecontainervalue}
              >
                Create
              </button>
            </div>
          </div>
          <div className='row' style={{ margin: '0px',paddingTop:'0px',paddingBottom:'0px',paddingLeft:'50px',paddingRight:'75px'}}>
            <table className="table" style={{ margin: '0px'}}>
            <thead style={{ backgroundColor: '#2b2a52', color: 'white' }}>
                     <tr>
                       <th className='col-lg-1'></th>
                       <th className='col-lg-3'>Video Name</th>
                       <th className='col-lg-1'>Action</th>
                     </tr>
                   </thead>
                   </table>
                   </div>
            
  </>
          )}
 <div className="table-container mb-3" style={{ height: '40vh' }}>
            {activeView === 'movie' && (
                <div className="row" style={{ marginLeft: '0px', marginRight: '0px', paddingTop: '0px', marginBottom: '0px' }}>
                    {videoContainer > 0 && (
                        <div className="w-100 h-auto ml-auto mr-auto pl-4 pr-4">
                            <table className="table" style={{ margin: '0px' }}>
                                <tbody>
                                    {videotableData.map((row, index) => (
                                        <tr key={index}>
                                            <td className="col-lg-1">{index + 1}</td>
                                            <td className="col-lg-3">
                                                <div className="dropdown-container" style={style.videodropdownContainer} ref={videodropdownRef}>
                                                    <input
                                                        type="text"
                                                        value={videoinputValues[index] || ""}
                                                        onClick={() => handlevideoDropdownToggle(index)}
                                                        onChange={(e) => handlevideoInputChanget(e, index)}
                                                        className="form-control border border-dark border-2 input-width col-lg-12"
                                                        style={style.videodropdownInput}
                                                        placeholder="Select an option"
                                                    />
                                                    {videodropdownStates[index] && (
                                                        <div className="col-lg-12 custom-scrollbar" style={style.videodropdownList}>
                                                            {videofilteredOptions.map((option, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="dropdown-item col-lg-12"
                                                                    style={style.videodropdownItem}
                                                                    onClick={() => handlevideoOptionClick(option, index)}
                                                                >
                                                                    {option}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="col-lg-1">
                                                <button onClick={() => handleVideoDelete(index)} className="btn btn-danger">
                                                    <i className="bi bi-trash3"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
        {activeView === 'movie' && (
              <>
              <div className='row py-3' style={{ marginLeft: '0px' ,marginRight: '0px',paddingRight:'70px'}} >
                       <div className='col-lg-9 '>
                          
                           </div>
                           <div className='col-lg-2'> 
                             <div className='col-lg-8'>
                           <button
                             className="btn border border-dark border-2  w-20 ml-11 text-black me-2 rounded-lg"  style={{ marginLeft: '65px' }}
                             // onClick={'handleUpdatecontainervalue'}  // Using the function here
                           >
                             Cancel
                           </button>
                           </div>
                           </div>
             
                           <div className='col-lg-1'><button
                             className="btn btn-primary"
                             style={{ backgroundColor: 'blue' }} onClick={handleSubmit}  // Using the function here
                           >
                             Submit
                           </button>
                           </div>
                         </div>
               </>
                       )}

        </div>
        </div>
        </div>
  );
};

export default Banner_setting;

