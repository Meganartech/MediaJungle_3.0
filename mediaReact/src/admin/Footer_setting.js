import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import "../css/Sidebar.css";

const Footer_setting = () => {
  const [step, setStep] = useState(1); // Track current step
  const [Meta_Title, setMeta_Title] = useState('');
  const [Meta_Author, setMeta_Author] = useState('');
  const [Meta_Keywords, setMeta_Keywords] = useState('');
  const [Meta_Description, setMeta_Description] = useState('');
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
  
  // Handler functions
  const changeMeta_TitleHandler = (event) => setMeta_Title(event.target.value);
  const changeMeta_AuthorHandler = (event) => setMeta_Author(event.target.value);
  const changeMeta_KeywordsHandler = (event) => setMeta_Keywords(event.target.value);
  const changeMeta_DescriptionHandler = (event) => setMeta_Description(event.target.value);
  
  // Handle form submission
  const save = (e) => {
    e.preventDefault();        
    let SiteSetting = { meta_title: Meta_Title, meta_author: Meta_Author, meta_keywords: Meta_Keywords, meta_description: Meta_Description };
    console.log('Site Setting =>', JSON.stringify(SiteSetting));
    // Call API to save SiteSetting (You should implement this part)
    setMeta_Author('');
    setMeta_Title('');
    setMeta_Description('');
    setMeta_Keywords('');
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
        <Dropdown className="mb-4" show={isOpen} onToggle={() => setIsOpen(!isOpen)}>
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
      <div className='container2 mt-2'>
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
                  <input type="text" value={Meta_Title} onChange={changeMeta_TitleHandler} className="form-control mb-3" />
                  <label>Body Script</label>
                  <input type="text" value={Meta_Author} onChange={changeMeta_AuthorHandler} className="form-control mb-3" />
                </>
              )}
              {step === 2 && (
                <>
                  <h4>Feature Box1</h4>
                  <label>Header Script</label>
                  <input type="text" value={Meta_Keywords} onChange={changeMeta_KeywordsHandler} className="form-control mb-3" />
                  <label>Body Script</label>
                  <input type="text" value={Meta_Description} onChange={changeMeta_DescriptionHandler} className="form-control mb-3" />
                </>
              )}
              {step === 3 && (
                <>
                  <h3>Contact Us</h3>
                  <label>Email</label>
                  <input type="email" className="form-control mb-3" />
                  <label>Body Script</label>
                  <input type="text" className="form-control mb-3" />
                  <h4>Call Us</h4>
                  <label>Phone Number</label>
                  <input type="text" className="form-control mb-3" />
                  <label>Body Script</label>
                  <input type="text" className="form-control mb-3" />
                  <h4>Location</h4>
                  <label>Map URL</label>
                  <input type="text" className="form-control mb-3" />
                  <label>Address</label>
                  <input type="text" className="form-control mb-3" />
                  <label>Contact Us Image</label>
                  <input type="file" className="form-control mb-3" />
                </>
              )}
              {step === 4 && (
                <>
                  <h4>App URL</h4>
                  <label>Playstore URL</label>
                  <input type="url" className="form-control mb-3" />
                  <label>App Store URL</label>
                  <input type="url" className="form-control mb-3" />
                  <h4>Copyright Content</h4>
                  <label>CopyRight Info</label>
                  <input type="text" className="form-control mb-3" />
                </>
              )}
              <div className="d-flex justify-content-between">
                {step > 1 && <button className="btn btn-primary" onClick={goToPreviousStep}>Previous</button>}
                {step < 4 && <button  className="btn btn-primary" onClick={goToNextStep}>Next</button>}
                {step === 4 && <button  className="btn btn-primary">Submit</button>}
                 </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer_setting;
