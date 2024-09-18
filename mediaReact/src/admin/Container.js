import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API_URL from '../Config';

const Container = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("Container Settings");
  const [activeView, setActiveView] = useState('movie');
  const [containers, setContainers] = useState([]);
  const [numOfContainers, setNumOfContainers] = useState(0);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const settingsOptions = [
    { name: "Site Settings", path: "/admin/SiteSetting" },
    { name: "Social Settings", path: "/admin/Social_setting" },
    { name: "Payment Settings", path: "/admin/Payment_setting" },
    { name: "Banner Settings", path: "/admin/Banner_setting" },
    { name: "Footer Settings", path: "/admin/Footer_setting" },
    { name: "Contact Settings", path: "/admin/Contact_setting" },
    { name: "Container Settings", path: "/admin/container" }
  ];

  const handleSettingChange = (setting) => {
    setSelectedSetting(setting.name);
    setIsOpen(false);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleContainerChange = (index, field, value) => {
    setContainers((prevContainers) => {
      const updatedContainers = [...prevContainers];
      updatedContainers[index] = { ...updatedContainers[index], [field]: value };
      return updatedContainers;
    });
  };

  const handleNumOfContainersChange = (e) => {
    const value = e.target.value;
    setNumOfContainers(value);
    setContainers(Array(parseInt(value, 10)).fill({ value: '', category: '' }));
    console.log(containers)
  };

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetAllCategories`)
      .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
      .then(data => setCategories(data))
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
      });
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation if needed
    if (containers.length === 0) {
      alert('No containers to submit');
      return;
    }

    // Submit the data (POST request)
    fetch(`${API_URL}/api/v2/videocontainer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ containers }),
    })
      .then(response => response.ok ? response.json() : Promise.reject('Error submitting containers'))
      .then(data => {
        console.log('Success:', data);
        // Handle success response
      })
      .catch(error => {
        console.error('Error submitting containers:', error);
        setError(error);
      });
  };

  return (
    <div className="marquee-container">
      <div className='AddArea'>
        <Dropdown className="mb-4" show={isOpen} onClick={() => setIsOpen(!isOpen)}>
          <Dropdown.Toggle className={`${isOpen ? 'bg-custom-color text-orange-600' : 'bg-custom-color'} hover:bg-custom-color hover:text-orange-600`}>
            {selectedSetting}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {settingsOptions.map((setting, index) => (
              <Dropdown.Item as={Link} to={setting.path} key={index} onClick={() => handleSettingChange(setting)}>
                {setting.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className='container3'>
        <ol className="breadcrumb mb-4 d-flex my-0">
          <li className="breadcrumb-item"><Link to="/admin/SiteSetting">Settings</Link></li>
          <li className="breadcrumb-item active text-white">Container Settings</li>
        </ol>

        <div className="outer-container">
          <div className="table-container">
            <div className="d-flex mb-4 mt-10 ml-10 toggle">
              <button className={`custom-btn px-4 mr-4 ${activeView === 'movie' ? 'active-btn' : 'inactive-btn'}`} onClick={() => handleViewChange('movie')}>
                Movie
              </button>
              <button className={`custom-btn px-4 ${activeView === 'music' ? 'active-btn' : 'inactive-btn'}`} onClick={() => handleViewChange('music')}>
                Music
              </button>
            </div>

            {activeView === 'movie' && (
              <>
                <div className="row py-3 my-3 align-items-center w-100">
                  <div className="col-md-3">
                    <label className="custom-label mt-4">No of Container</label>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted d-block mt-2">Max 20 containers only*</small>
                    <input
                      type='number'
                      id="noOfContainers"
                      required
                      className="form-control border border-dark border-2"
                      value={numOfContainers}
                      onChange={handleNumOfContainersChange}
                      max="20"
                      placeholder="No of Container"
                    />
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="table table-bordered">
                    <thead style={{ backgroundColor: '#2b2a52', color: 'white' }}>
                      <tr>
                        <th>S.No</th>
                        <th>Container</th>
                        <th>Category Name</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {containers.map((container, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Container"
                              value={container.value}
                              onChange={(e) => handleContainerChange(index, 'value', e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              className="form-control"
                              value={container.category}
                              onChange={(e) => handleContainerChange(index, 'category', e.target.value)}
                            >
                              <option value="">Choose Category</option>
                              {categories.map(option => (
                                <option key={option.category_id} value={option.category_id}>
                                  {option.categories}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button className="btn btn-danger">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeView === 'music' && (
              <div>
                <h2>Music Section</h2>
                <p>Here you can listen to music tracks.</p>
              </div>
            )}

            <div className="row py-3 my-5 w-100">
              <div className="col-md-8 ms-auto text-end">
                <button className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg">Cancel</button>
                <button className="border border-dark border-2 p-1.5 w-20 mr-10 text-white rounded-lg" style={{ backgroundColor: 'blue' }} onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
