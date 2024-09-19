import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import "../css/Sidebar.css";

const Footer_setting = () => {
  const [step, setStep] = useState(1); 
  // Track current step
  const save = async (event) => {
    
    event.preventDefault();
    
    const formData = {
      aboutUsHeaderScript: document.querySelector('input[name="aboutUsHeaderScript"]').value,
      aboutUsBodyScript: document.querySelector('input[name="aboutUsBodyScript"]').value,
      
      featureBox1HeaderScript: document.querySelector('input[name="featureBox1HeaderScript"]').value,
      featureBox1BodyScript: document.querySelector('input[name="featureBox1BodyScript"]').value,
  
      contactUsEmail: document.querySelector('input[name="contactUsEmail"]').value,
      contactUsBodyScript: document.querySelector('input[name="contactUsBodyScript"]').value,
      callUsPhoneNumber: document.querySelector('input[name="callUsPhoneNumber"]').value,
      callUsBodyScript: document.querySelector('input[name="callUsBodyScript"]').value,
      locationMapUrl: document.querySelector('input[name="locationMapUrl"]').value,
      locationAddress: document.querySelector('input[name="locationAddress"]').value,
      contactUsImage: document.querySelector('input[name="contactUsImage"]').files[0],
  
      appUrlPlaystore: document.querySelector('input[name="appUrlPlaystore"]').value,
      appUrlAppStore: document.querySelector('input[name="appUrlAppStore"]').value,
      copyrightInfo: document.querySelector('input[name="copyrightInfo"]').value,
    };
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    try {
      const response = await fetch('/api/footer-settings/submit', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (response.ok) {
        alert('Form submitted successfully!');
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
  const goToNextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const goToPreviousStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Progress bar calculation
  const progress = (step / 4) * 100;

  return (
    <div className="marquee-container">
      <div className='AddArea'>
        {/* Dropdown for settings */}
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
            <div className="progress mb-3">
              <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <form onSubmit={save} className="registration-form">
  {step === 1 && (
    <>
      <h3>About Us</h3>
      <label>Header Script</label>
      <input type="text" name="aboutUsHeaderScript" className="form-control mb-3" />
      <label>Body Script</label>
      <input type="text" name="aboutUsBodyScript" className="form-control mb-3" />
    </>
  )}
  {step === 2 && (
    <>
      <h4>Feature Box1</h4>
      <label>Header Script</label>
      <input type="text" name="featureBox1HeaderScript" className="form-control mb-3" />
      <label>Body Script</label>
      <input type="text" name="featureBox1BodyScript" className="form-control mb-3" />
    </>
  )}
  {step === 3 && (
    <>
      <h3>Contact Us</h3>
      <label>Email</label>
      <input type="email" name="contactUsEmail" className="form-control mb-3" />
      <label>Body Script</label>
      <input type="text" name="contactUsBodyScript" className="form-control mb-3" />
      <h4>Call Us</h4>
      <label>Phone Number</label>
      <input type="text" name="callUsPhoneNumber" className="form-control mb-3" />
      <label>Body Script</label>
      <input type="text" name="callUsBodyScript" className="form-control mb-3" />
      <h4>Location</h4>
      <label>Map URL</label>
      <input type="text" name="locationMapUrl" className="form-control mb-3" />
      <label>Address</label>
      <input type="text" name="locationAddress" className="form-control mb-3" />
      <label>Contact Us Image</label>
      <input type="file" name="contactUsImage" className="form-control mb-3" />
    </>
  )}
  {step === 4 && (
    <>
      <h4>App URL</h4>
      <label>Playstore URL</label>
      <input type="url" name="appUrlPlaystore" className="form-control mb-3" />
      <label>App Store URL</label>
      <input type="url" name="appUrlAppStore" className="form-control mb-3" />
      <h4>Copyright Content</h4>
      <label>CopyRight Info</label>
      <input type="text" name="copyrightInfo" className="form-control mb-3" />
    </>
  )}
  <div className="d-flex justify-content-between">
    {step > 1 && (
      <button
        type="button"
        className="btn btn-primary"
        onClick={goToPreviousStep}
      >
        Previous
      </button>
    )}
    {step < 4 && (
      <button
        type="button"
        className="btn btn-primary"
        onClick={goToNextStep}
      >
        Next
      </button>
    )}
    {step === 4 && (
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    )}
  </div>
</form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer_setting;
