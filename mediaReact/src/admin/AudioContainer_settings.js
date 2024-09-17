import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../csstemp/addAudio.css';
import ReactPlayer from 'react-player';
import API_URL from '../Config';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../App.css"
import { useRef } from 'react';

const AudioContainer_settings = () => {

  const styles = {
    dropdownContainer: {
      width: "100px",
      position: "relative",
      margin: "20px",
    },
    dropdownInput: {
      width: "100%",
      padding: "8px",
      boxSizing: "border-box",
    },
    dropdownList: {
      position: "absolute",
      top: "40px",
      left: "0",
      width: "100%",
      maxHeight: "150px", // Maximum height for scrollable dropdown
      overflowY: "auto", // Enable scrolling
      backgroundColor: "white",
      border: "1px solid #ccc",
      zIndex: 1,
    },
    dropdownItem: {
      padding: "8px",
      cursor: "pointer",
    },
  };


  const [audioTitle, setAudioTitle] = useState(0); // Number of rows to generate
const [tableData, setTableData] = useState([]);  // Data for the table
const [categories, setCategories] = useState([]);
const [filteredOptions, setFilteredOptions] = useState([]);
const [inputValues, setInputValues] = useState([]); // Track input values for each row
const [dropdownStates, setDropdownStates] = useState([]); // Track dropdown open/close states for each row

// Fetch categories from the API
useEffect(() => {
  fetch(`${API_URL}/api/v2/GetAllCategories`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const categoryNames = data.map(item => item.categories);
      setCategories(categoryNames);
      setFilteredOptions(categoryNames);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}, []);

// Handle input change for filtering options
const handleInputChanget = (e, index) => {
  const value = e.target.value.toLowerCase();  // Convert the input to lowercase
  const updatedInputValues = [...inputValues];
  updatedInputValues[index] = value;
  setInputValues(updatedInputValues);

  // Separate options that start with the value from those that contain it elsewhere
  const startsWithValue = categories.filter(option =>
    option.toLowerCase().startsWith(value)  // Options that start with the input
  );
  
  const containsValue = categories.filter(option =>
    option.toLowerCase().includes(value) && !option.toLowerCase().startsWith(value)  // Options that contain but don't start with the input
  );

  // Combine the two lists, with starting matches first
  const filtered = [...startsWithValue, ...containsValue];

  setFilteredOptions(filtered);  // Update the filtered options
};


// Toggle dropdown for specific row
const handleDropdownToggle = (index) => {
  const updatedDropdownStates = [...dropdownStates];
  updatedDropdownStates[index] = !updatedDropdownStates[index];
  setDropdownStates(updatedDropdownStates);
};

// Handle selecting an option
const handleOptionClick = (option, index) => {
  const updatedInputValues = [...inputValues];
  updatedInputValues[index] = option;
  setInputValues(updatedInputValues);

  const updatedDropdownStates = [...dropdownStates];
  updatedDropdownStates[index] = false;
  setDropdownStates(updatedDropdownStates);
  const newValue = option;
  const updatedData = tableData.map((row, i) => {
    if (i === index) {
      return { ...row, categoryName: newValue };  // Dynamically update the field
    }
    return row;  // Return other rows unchanged
  });
  setTableData(updatedData);








};

// Generate table rows based on the audioTitle count
useEffect(() => {
  const rows = Array.from({ length: audioTitle }, (_, index) => ({
    sno: index + 1,
    container: '',
    categoryName: ''
  }));
  setTableData(rows);
  setDropdownStates(Array(audioTitle).fill(false)); // Initialize dropdown states
  setInputValues(Array(audioTitle).fill("")); // Initialize input values
}, [audioTitle]);

// Handle input change in the table rows
const handleInputChange = (e, index, field) => {
  const newValue = e.target.value;
  const updatedData = tableData.map((row, i) => {
    if (i === index) {
      return { ...row, [field]: newValue };
    }
    return row;
  });
  setTableData(updatedData);
};

// Handle form submission
const handleSubmit = () => {
  const jsonData = JSON.stringify(tableData, null, 2); // Convert tableData to JSON
  console.log('Submitted Data:', jsonData);
};

// Handle row deletion
const handleDelete = (index) => {
  const updatedData = tableData.filter((_, i) => i !== index);
  setTableData(updatedData);
  setAudioTitle(audioTitle - 1); // Reduce the count
};

// return (
//   <div className='container3 mt-20'>
//     {/* Your other components */}
//     <div className='row' style={{ paddingTop: '0px' }} >
     
//     </div>
//   </div>
// );


  // const [audioTitle, setAudioTitle] = useState(); // Number of rows to generate
  // const [tableData, setTableData] = useState([]);  // Data for the table
  // const [categories, setCategories] = useState([]);
  // const [filteredOptions, setFilteredOptions] = useState([]);
  // const [inputValue, setInputValue] = useState("");
  // const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch categories from the API
  // useEffect(() => {
  //   fetch(`${API_URL}/api/v2/GetAllCategories`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       // Extract categories from the response
  //       const categoryNames = data.map(item => item.categories);
  //       setCategories(categoryNames);
  //       setFilteredOptions(categoryNames);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

  // const handleInputChanget = (e) => {
  //   const value = e.target.value;
  //   setInputValue(value);
  //   // Filter options based on input
  //   const filtered = categories.filter(option =>
  //     option.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredOptions(filtered);
  // };

  // const handleDropdownToggle = () => {
  //   setDropdownOpen(!isDropdownOpen);
  // };

  // const handleOptionClick = (option) => {
  //   setInputValue(option);
  //   setDropdownOpen(false);
  //   setSelectedCategories(option);
  // };

  // // Generate table rows based on the audioTitle count
  // useEffect(() => {
  //   const rows = Array.from({ length: audioTitle }, (_, index) => ({
  //     sno: index + 1,
  //     container: '',
  //     categoryName: ''
  //   }));
  //   setTableData(rows);
  // }, [audioTitle]);

  // // Handle input change in the table rows
  // const handleInputChange = (e, index, field) => {
  //   const newValue = e.target.value;

  //   const updatedData = tableData.map((row, i) => {
  //     if (i === index) {
  //       return { ...row, [field]: newValue };
  //     }
  //     return row;
  //   });

  //   setTableData(updatedData);
  // };

  // // Handle form submission
  // const handleSubmit = () => {
  //   const jsonData = JSON.stringify(tableData, null, 2); // Convert tableData to JSON
  //   console.log('Submitted Data:', jsonData);
  // };

  // // Handle row deletion
  // const handleDelete = (index) => {
  //   const updatedData = tableData.filter((_, i) => i !== index);
  //   setTableData(updatedData);
  //   setAudioTitle(audioTitle - 1); // Reduce the count
  // };
  return (
    <div className='container3 mt-20'>
      <ol className="breadcrumb mb-4 d-flex my-0">
        {/* <li className="breadcrumb-item"><Link to="/admin/ListAudio">Setting</Link></li> */}
        <li className="breadcrumb-item active text-white">Container Setting</li>
      </ol>
      <div className="outer-container">
        <div className="table-container" style={{ height: '63vh' }} >
          <div className="row py-3 my-3 align-items-center w-100">
            <div className='col-2'>Movie
            </div>
            <div className='row' style={{ paddingBottom: '0px' }} >
              <div className='col-lg-2'>no of container
              </div>
              <div className='col-lg-2'> <div className="flex-grow-1">
                <input
                  type="number"
                  name="Audio Title Count"
                  id="audioTitle"
                  required
                  className="form-control border border-dark border-2 input-width"
                  placeholder="Enter Number of Containers"
                  value={audioTitle === 0 ? '' : audioTitle}  // Show empty field when value is 0
                  min="0"  // Prevent negative numbers
                  step="1" // Only allow integers
                  onChange={(e) => {
                    const value = e.target.value;

                    // Remove leading zeros
                    const sanitizedValue = value.replace(/^0+(?=\d)/, '');

                    // Allow only digits and empty value (for clearing)
                    if (/^\d*$/.test(sanitizedValue)) {
                      setAudioTitle(sanitizedValue === '' ? 0 : parseInt(sanitizedValue, 10));
                    }
                  }}
                />
              </div>
              </div>
            </div>
            <div className='row' style={{ paddingTop: '0px' }} >
              {/* {audioTitle > 0 && (
                <table border="1" cellPadding="10" cellSpacing="0" className="mt-3">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Container</th>
                      <th>Category Name</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.sno}</td>
                        <td>
                          <input
                            type="text"
                            name="Container"
                            className="form-control border border-dark border-2 input-width"
                            placeholder="Enter Container"
                            value={row.container}
                            onChange={(e) => handleInputChange(e, index, 'container')}
                          />
                        </td>
                        <td>
                          <div className="dropdown-container" style={styles.dropdownContainer}>
                            <input
                              type="text"
                              value={inputValue}
                              onClick={handleDropdownToggle}
                              onChange={handleInputChanget}
                              className="dropdown-input"
                              style={styles.dropdownInput}
                              placeholder="Select an option"
                            />
                            {isDropdownOpen && (
                              <div className="dropdown-list" style={styles.dropdownList}>
                                {filteredOptions.map((option, index) => (
                                  <div
                                    key={index}
                                    className="dropdown-item"
                                    style={styles.dropdownItem}
                                    onClick={() => handleOptionClick(option)}
                                  >
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                            <br />
                          </div>
                        </td>
                        <td>
                          <button onClick={() => handleDelete(index)} className="btn btn-danger bi bi-trash3">
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )} */}
               {audioTitle > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0" className="mt-3">
          <thead>
            <tr>
              <th></th>
              <th>Container</th>
              <th>Category Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.sno}</td> {/* Automatically incremented S.No */}
                <td>
                  <input
                    type="text"
                    name="Container"
                    className="form-control border border-dark border-2 input-width"
                    placeholder="Enter Container"
                    value={row.container}
                    onChange={(e) => handleInputChange(e, index, 'container')}
                  />
                </td>
                <td>
                  <div className="dropdown-container" style={styles.dropdownContainer}>
                    <input
                      type="text"
                      value={inputValues[index] || ""}
                      onClick={() => handleDropdownToggle(index)}
                      onChange={(e) => handleInputChanget(e, index)}
                      className="dropdown-input"
                      style={styles.dropdownInput}
                      placeholder="Select an option"
                    />
                    {dropdownStates[index] && (
                      <div className="dropdown-list" style={styles.dropdownList}>
                        {filteredOptions.map((option, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item"
                            style={styles.dropdownItem}
                            onClick={() => handleOptionClick(option, index)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                    <br />
                  </div>
                </td>
                <td>
                  <button onClick={() => handleDelete(index)} className="btn btn-danger bi bi-trash3">
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
            </div>
          </div>
        </div>
        <div className="row py-1 my-1 w-100">
          <div className="col-md-8 ms-auto text-end">
            <>
              <button
                className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                type="button"
                onClick={'prevStep'}
              >
                Back
              </button>
              {audioTitle > 0 && (
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                  onClick={handleSubmit}

                >
                  Submit
                </button>)}
            </>

          </div>
        </div>
      </div>
    </div>


  );
};





// return (
//     <div>
//       {/* Input to set the number of rows */}
//       <div className="flex-grow-1 mb-3">
//         <input
//           type="number"
//           name="Audio Title Count"
//           id="audioTitle"
//           required
//           className="form-control border border-dark border-2 input-width"
//           placeholder="Enter Number of Containers"
//           value={audioTitle}
//           onChange={handleAudioTitleChange} // onChange handler
//         />
//       </div>

//       {/* Table */}
//       {audioTitle > 0 && (
//         <table border="1" cellPadding="10" cellSpacing="0" className="mt-3">
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>Container</th>
//               <th>Category Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, index) => (
//               <tr key={index}>
//                 <td>{row.sno}</td> {/* Automatically incremented S.No */}
//                 <td>
//                   <input
//                     type="text"
//                     name="Container"
//                     className="form-control border border-dark border-2 input-width"
//                     placeholder="Enter Container"
//                     value={row.container}
//                     onChange={(e) => handleInputChange(e, index, 'container')}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="text"
//                     name="Category Name"
//                     className="form-control border border-dark border-2 input-width"
//                     placeholder="Enter Category Name"
//                     value={row.categoryName}
//                     onChange={(e) => handleInputChange(e, index, 'categoryName')}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Submit button to submit the data */}
//       {audioTitle > 0 && (
//         <div className="mt-3">
//           <button onClick={handleSubmit} className="btn btn-primary">
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

export default AudioContainer_settings
