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


  const [audioTitle, setAudioTitle] = useState(0);  // Actual state used for audioTitle
  const [inputValue, setInputValue] = useState('');  // Internal input value
  const [tableData, setTableData] = useState([]);  // Data for the table
  const [categories, setCategories] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [inputValues, setInputValues] = useState([]); // Track input values for each row
  const [dropdownStates, setDropdownStates] = useState([]); // Track dropdown open/close states for each row
  const token = sessionStorage.getItem("tokenn")

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
        // setCategories(categoryNames);
        setCategories(data);
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

    const value2=e.target.value;
    const category = categories.find(cat => cat.categories === value2);
    const data=category ? category.category_id : null;


    const updatedData = tableData.map((row, i) => {
      if (i === index) {
        return { ...row, categoryId: data };  // Dynamically update the field
      }
      return row;  // Return other rows unchanged
    });
    setTableData(updatedData);
  
    const categoryNames = categories.map(item => item.categories);
    // Separate options that start with the value from those that contain it elsewhere
    const startsWithValue = categoryNames.filter(option =>
      option.toLowerCase().startsWith(value)  // Options that start with the input
    );

    const containsValue = categoryNames.filter(option =>
      option.toLowerCase().includes(value) && !option.toLowerCase().startsWith(value)  // Options that contain but don't start with the input
    );

    // Combine the two lists, with starting matches first
    const filtered = [...startsWithValue, ...containsValue];

    setFilteredOptions(filtered);  // Update the filtered options
  };
  const handleDropdownToggleselect =(index)=>{
    const updatedDropdownStatesToFalse = dropdownStates.map(() => false);
    setDropdownStates(updatedDropdownStatesToFalse);

  }

  // Toggle dropdown for specific row
  const handleDropdownToggle = (index) => {
    // const updatedDropdownStatesToFalse = dropdownStates.map(() => false);
    // const updatedDropdownStates = [...updatedDropdownStatesToFalse];
    // updatedDropdownStates[index] = !updatedDropdownStates[index];

    setDropdownStates(prevDropdownStates => 
      prevDropdownStates.map((state, i) => (i === index ? !state : false))
    );
    
    // setDropdownStates(updatedDropdownStates);
  };
  console.log("dropdownStates.length")
  console.log(dropdownStates.length)

  // Handle selecting an option
  const handleOptionClick = (option, index) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = option;
    setInputValues(updatedInputValues);

    const updatedDropdownStates = [...dropdownStates];
    updatedDropdownStates[index] = false;
    setDropdownStates(updatedDropdownStates);
    const newValue = option;
    
    const category = categories.find(cat => cat.categories === newValue);
    const data=category ? category.category_id : null;


    const updatedData = tableData.map((row, i) => {
      if (i === index) {
        return { ...row, categoryId: data };  // Dynamically update the field
      }
      return row;  // Return other rows unchanged
    });
    setTableData(updatedData);
    const categoryNames = categories.map(item => item.categories);
    setFilteredOptions(categoryNames)








  };

  // Generate table rows based on the audioTitle count
  // useEffect(() => {
  //   const rows = Array.from({ length: audioTitle }, (_, index) => ({
  //     sno: index + 1,
  //     container: '',
  //     categoryName: ''
  //   }));
  //   setTableData(rows);
  //   setDropdownStates(Array(audioTitle).fill(false)); // Initialize dropdown states
  //   setInputValues(Array(audioTitle).fill("")); // Initialize input values
  // }, [audioTitle]);

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

      try {
        const AudioData = new FormData();
 
        tableData.forEach((id) => {
          AudioData.append('audiocontainer', id);
        });

        for (let [key, value] of AudioData.entries()) {
          console.log(key + " :", value);
        }
        const saveResponse =axios.post(`${API_URL}/api/v2/audiocontainer`, AudioData, {
          headers: {
            Authorization: token, // Pass the token in the Authorization header
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(AudioData)
        if (saveResponse.status === 200) {
         
          Swal.fire({
            title: 'Success!',
            text: 'Containers and Categoryes  data saved successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Error saving Containers and Categoryes  data',
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
  
    console.log('Submitted Data:', jsonData);
  };

  // Handle row deletion
  const handleDelete = (index) => {
    console.log('inside function')
    console.log(tableData)
    const updatedData = tableData.filter((_, i) => i !== index);

    const updatedDropdownStates = dropdownStates.filter((_, i) => i !== index);
    setDropdownStates(updatedDropdownStates);

    // Delete the item at the specific index from inputValues
    const updatedInputValues = inputValues.filter((_, i) => i !== index);
    setInputValues(updatedInputValues);
    
    setTableData(updatedData);
    setAudioTitle(audioTitle - 1); // Reduce the count
    setInputValue(updatedData.length);
  };
  console.log('outside function')
  console.log(tableData)
  console.log(dropdownStates)
  console.log(inputValues)
  // Function to handle the value update and check
  const handleUpdatecontainervalue = () => {
    const newValue = parseInt(inputValue, 10);

    if (inputValue === '') {
      alert('Please enter a valid number');
      return;
    }

    if (newValue <= audioTitle) {
      // Alert if the new value is less than the existing audioTitle
      alert('New value cannot be less than the existing value');

      console.log(" new value  lesser than === audiotitle value")
      setInputValue(audioTitle);
    } else {
      // Update audioTitle only if the new value is valid
      if (audioTitle <= 0) {

        console.log("audio less than === 0")
        setAudioTitle(newValue);
        const rows = Array.from({ length: inputValue }, (_, index) => ({
          container_name: '',
          categoryId: ''
        }));
        setTableData(rows);
        setInputValue(newValue);
        setAudioTitle(newValue);
        setDropdownStates(Array(newValue).fill(false)); // Initialize dropdown states
        setInputValues(Array(newValue).fill("")); // Initialize input values
      }
      else if (audioTitle >= 0) {

        console.log("audio greater than === 0")
        setTableData((prevData) => {
          // Check if the current inputValue exceeds the existing rows in tableData
          if (newValue > prevData.length) {
            // Add new rows while keeping the existing ones intact
            const newRows = Array.from({ length: newValue - prevData.length }, () => ({
              container_name: '',
              categoryId: ''
            }));
            return [...prevData, ...newRows]; // Combine old rows with new empty rows      
          }
          return prevData; // If inputValue is less than or equal, return existing data
        });

        setDropdownStates((prevDropdownStates) => {
          // Check if inputValue exceeds the current length of dropdownStates
          if (newValue > prevDropdownStates.length) {
            // Add 'false' values to the end of dropdownStates
            const extraStates = Array(newValue - prevDropdownStates.length).fill(false);
            return [...prevDropdownStates, ...extraStates]; // Combine old states with new 'false' values
          }
          return prevDropdownStates; // If inputValue is less than or equal, return existing data
        });
        setInputValues((prevInputValues) => {
          // Check if inputValue exceeds the current length of dropdownStates
          if (newValue > prevInputValues.length) {
            // Add 'false' values to the end of dropdownStates
            const extraValues = Array(newValue - prevInputValues.length).fill("");
            return [...prevInputValues, ...extraValues]; // Combine old states with new 'false' values
          }
          return prevInputValues; // If inputValue is less than or equal, return existing data
        });

        setInputValue(newValue);
        setAudioTitle(newValue);

        // setDropdownStates(Array(inputValue).fill(false)); // Initialize dropdown states
        // setInputValues(Array(inputValue).fill("")); // Initialize input values
      }
    }




  };
  console.log('audioTitle')
  console.log(audioTitle)
  console.log('inputValue')
  console.log(inputValue)

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
                  value={inputValue === 0 ? '' : inputValue}  // Show empty field when value is 0
                  min="0"  // Prevent negative numbers
                  step="1" // Only allow integers
                  onChange={(e) => {
                    const value = e.target.value;

                    // Remove leading zeros
                    const sanitizedValue = value.replace(/^0+(?=\d)/, '');

                    // Allow only digits and empty value
                    if (/^\d*$/.test(sanitizedValue)) {
                      setInputValue(sanitizedValue === '' ? 0 : sanitizedValue);
                    }
                  }}
                />
              </div>
              </div>

              <div className='col-lg-2'><button
                className="btn btn-primary"
                onClick={handleUpdatecontainervalue}  // Using the function here
              >
                Create
              </button>
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
                        <td>{index + 1}</td> {/* Automatically incremented S.No */}
                        <td>
                          <input
                            type="text"
                            name="Container"
                            className="form-control border border-dark border-2 input-width"
                            placeholder="Enter Container"
                            value={row.container_name}
                            onClick={() => handleDropdownToggleselect(index)}
                            onChange={(e) => handleInputChange(e, index, 'container_name')}
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
