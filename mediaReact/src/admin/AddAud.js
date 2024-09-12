// import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

// import screenfull from 'screenfull'; // For
import React, { useState, useEffect } from 'react';
import API_URL from '../Config';



// import screenfull from 'screenfull'; // For


const AddAud = () => {

  const options = [
    "hores", "romantic", "blockbusters", "Best of 2020", "thriller",
    "Science finction", "mystery", "Rushhours", "Action", "drama",
    "fanatsy", "Documentary", "animation", "Historical", "Fiction",
    "elegante", "Extrodinory", "Top10", "top20", "Mithical"
  ];
  
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [castandcrewlistName, setcastandcrewlistName] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    setDropdownOpen(false);

    // const isChecked = e.target.checked;
    // const id = (option.id); // Convert ID to number
    const name = (option);

      // setcastandcrewlist((prevList) => [...prevList, id]);
      setcastandcrewlistName((prevList) => [...prevList, `${name},`]);
   
  }; 


  return (
    <div className= "row"> 
    <div className="dropdown-container" style={styles.dropdownContainer}>
      <input
        type="text"
        value={inputValue}
        onClick={handleDropdownToggle}
        onChange={handleInputChange}
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


      <br></br>
    </div>
     <div>
     {castandcrewlistName}
     </div></div>
);
};
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
    overflowY: "auto",  // Enable scrolling
    backgroundColor: "white",
    border: "1px solid #ccc",
    zIndex: 1,
  },
  dropdownItem: {
    padding: "8px",
    cursor: "pointer",
  },
};
export default AddAud;