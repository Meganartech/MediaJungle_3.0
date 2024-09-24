import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import "../css/Sidebar.css";

const Footer_setting = () => {
  // State to manage all form data
  const [formData, setFormData] = useState({
    aboutUsHeaderScript: '',
    aboutUsBodyScript: '',
    featureBox1HeaderScript: '',
    featureBox1BodyScript: '',
    featureBox2HeaderScript: '',
    featureBox2BodyScript: '',
    aboutUsImage:'null',
    contactUsEmail: '',
    contactUsBodyScript: '',
    callUsPhoneNumber: '',
    callUsBodyScript: '',
    locationMapUrl: '',
    locationAddress: '',
    contactUsImage: null, // Handle file upload
    appUrlPlaystore: '',
    appUrlAppStore: '',
    copyrightInfo: '',
  });

  const [step, setStep] = useState(1); // Track current step
  const [isUpdating, setIsUpdating] = useState(false); 
    // Fetch existing data to prefill the form when the component mounts
    useEffect(() => {
      const fetchFooterSettings = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/v2/footer-settings');
          const data = await response.json();
          if (response.ok && data) {
            setFormData({
              ...data,
              aboutUsImage: data.aboutUsImage || null, // Assuming the image URL comes from the API
            });
            setIsUpdating(true);
          }
        } catch (error) {
          console.error('Error fetching footer settings:', error);
        }
      };
      fetchFooterSettings();
    }, []);
    
    const handleFileChange = (e) => {
      const { name, files } = e.target;
      if (files.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0], // Store the file for upload
        }));
        console.log("Selected file:", files[0]); // Log the selected file
      }
    };
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const save = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    
    // Append form data to FormData object
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const url = isUpdating 
        ? 'http://localhost:8080/api/v2/footer-settings/update' // Update URL
        : 'http://localhost:8080/api/v2/footer-settings/submit'; // Submit URL
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert(isUpdating ? 'Form updated successfully!' : 'Form submitted successfully!');
      } else {
        alert('Failed to submit the form.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting the form.');
    }
  };

  // State for dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("Footer Settings");
  
  // Dropdown settings options
  const settingsOptions = [
    { name: "Site Settings", path: "/admin/SiteSetting" },
    { name: "Social Settings", path: "/admin/Social_setting" },
    { name: "Payment Settings", path: "/admin/Payment_setting" },
    { name: "Banner Settings", path: "/admin/Banner_setting" },
    { name: "Footer Settings", path: "/admin/Footer_setting" },
    { name: "Contact Settings", path: "/admin/Contact_setting" }
  ];

  // Handle dropdown setting change
  const handleSettingChange = (setting) => {
    setSelectedSetting(setting.name);
    setIsOpen(false);
  };

  // Navigation functions
  const goToNextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const goToPreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Progress bar calculation
  const progress = (step / 4) * 100;

  return (
    <div className="marquee-container">
    <div className='AddArea'>
      <Dropdown show={isOpen} onToggle={() => setIsOpen(!isOpen)}>
        <Dropdown.Toggle className={`bg-custom-color ${isOpen ? 'text-orange-600' : ''} hover:bg-custom-color hover:text-orange-600`}>
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
    <br />
    <div className='container2'>
      <ol className="breadcrumb mb-4 d-flex my-0">
        <li className="breadcrumb-item">
          <Link to="/admin/SiteSetting">Settings</Link>
        </li>
        <li className="breadcrumb-item active text-white">Footer Settings</li>
      </ol>
      <div className="table-container">
        <div className="card-body">
          <div className="modern-progress-bar">
            <div className="progress-indicator" style={{ width: `${(step / 3) * 100}%` }} />
            <div className="steps">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`step ${index < step ? 'completed' : ''}`}>
                  <span>{`Step ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={save} className="registration-form">
              {step === 1 && (
                <>
                  <h3>About Us</h3>
                  <label>Header Script</label>
                  <input type="text" name="aboutUsHeaderScript" className="form-control mb-3" value={formData.aboutUsHeaderScript} onChange={handleInputChange} />
                  <label>Body Script</label>
                  <input type="text" name="aboutUsBodyScript" className="form-control mb-3" value={formData.aboutUsBodyScript} onChange={handleInputChange} />
                  <h4>Feature Box1</h4>
                  <label>Header Script</label>
                  <input type="text" name="featureBox1HeaderScript" className="form-control mb-3" value={formData.featureBox1HeaderScript} onChange={handleInputChange} />
                  <label>Body Script</label>
                  <input type="text" name="featureBox1BodyScript" className="form-control mb-3" value={formData.featureBox1BodyScript} onChange={handleInputChange} />
                  <h4>Feature Box2</h4>
                  <label>Header Script</label>
                  <input type="text" name="featureBox2HeaderScript" className="form-control mb-3" value={formData.featureBox2HeaderScript} onChange={handleInputChange} />
                  <label>Body Script</label>
                  <input type="text" name="featureBox2BodyScript" className="form-control mb-3" value={formData.featureBox2BodyScript} onChange={handleInputChange} />
                  <label>About Us Image</label>
{formData.aboutUsImage ? (
  typeof formData.aboutUsImage === 'string' ? (
    <p>Existing image: {formData.aboutUsImage}</p> // Display existing image name
  ) : (
    <p>Selected file: {formData.aboutUsImage.name}</p> // Display selected file name
  )
) : (
  <p>No image selected</p>
)}
<input type="file" name="aboutUsImage" className="form-control mb-3" onChange={handleFileChange} />

                </>
              )}
              {step === 2 && (
                <>
                  <h3>Contact Us</h3>
                  <label>Email</label>
                  <input type="email" name="contactUsEmail" className="form-control mb-3" value={formData.contactUsEmail} onChange={handleInputChange} />
                  <label>Body Script</label>
                  <input type="text" name="contactUsBodyScript" className="form-control mb-3" value={formData.contactUsBodyScript} onChange={handleInputChange} />
                  <h4>Call Us</h4>
                  <label>Phone Number</label>
                  <input type="text" name="callUsPhoneNumber" className="form-control mb-3" value={formData.callUsPhoneNumber} onChange={handleInputChange} />
                  <label>Body Script</label>
                  <input type="text" name="callUsBodyScript" className="form-control mb-3" value={formData.callUsBodyScript} onChange={handleInputChange} />
                  <h4>Location</h4>
                  <label>Map URL</label>
                  <input type="text" name="locationMapUrl" className="form-control mb-3" value={formData.locationMapUrl} onChange={handleInputChange} />
                  <label>Address</label>
                  <input type="text" name="locationAddress" className="form-control mb-3" value={formData.locationAddress} onChange={handleInputChange} />
                  <label>Header Image</label>
{formData.contactUsImage ? (
  typeof formData.contactUsImage === 'string' ? (
    <p>Existing image: {formData.contactUsImage}</p> // Display existing image name
  ) : (
    <p>Selected file: {formData.contactUsImage.name}</p> // Display selected file name
  )
) : (
  <p>No image selected</p>
)}
<input type="file" name="contactUsImage" className="form-control mb-3" onChange={handleFileChange} />

                </>
              )}
              {step === 3 && (
                <>
                  <h4>App URL</h4>
                  <label>Playstore URL</label>
                  <input type="url" name="appUrlPlaystore" className="form-control mb-3" value={formData.appUrlPlaystore} onChange={handleInputChange} />
                  <label>App Store URL</label>
                  <input type="url" name="appUrlAppStore" className="form-control mb-3" value={formData.appUrlAppStore} onChange={handleInputChange} />
                  <h4>Copyright Content</h4>
                  <label>CopyRight Info</label>
                  <input type="text" name="copyrightInfo" className="form-control mb-3" value={formData.copyrightInfo} onChange={handleInputChange} />
                </>
              )}
              <div className="d-flex justify-content-between">
                {step > 1 && (
                  <button type="button" className="btn btn-primary" style={{backgroundColor: "#007bff"}} onClick={goToPreviousStep}>
                    Previous
                  </button>
                )}
                {step < 3 && (
                  <button type="button" className="btn btn-primary" style={{backgroundColor: "#007bff"}} onClick={goToNextStep}>
                    Next
                  </button>
                )}
                {step === 3 && (
                   <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#007bff" }}>
                   {isUpdating ? 'Update' : 'Submit'}
                 </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer_setting;
