import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import Setting_sidebar from './Setting_sidebar';
import Employee from './Employee'
import "../css/Sidebar.css";
const Setting = () => {
  

  
 

 

   
   
  
 
//===========================================API--G================================================================
        const [siteName, setSiteName] = useState('');
        const changeSiteNameHandler = (event) => {
          const newValue = event.target.value;
          setSiteName(newValue); // Updating the state using the setter function from useState
      };
      const [AppURL, setAppURL] = useState('');
        const changeAppURLHandler = (event) => {
          const newValue = event.target.value;
          setAppURL(newValue); // Updating the state using the setter function from useState
      };
      const [TagName, setTagName] = useState('');
        const changeTagNameHandler = (event) => {
          const newValue = event.target.value;
          setTagName(newValue); // Updating the state using the setter function from useState
      };
      const [Icon, setIcon] = useState('');
        const changeIconHandler = (event) => {
          const newValue = event.target.value;
          setIcon(newValue); // Updating the state using the setter function from useState
      };
      const [Logo, setLogo] = useState('');
        const changeLogoHandler = (event) => {
          const newValue = event.target.value;
          setLogo(newValue); // Updating the state using the setter function from useState
      };
      const saveEmployee=(e)=>{
        e.preventDefault();        
        let SiteSetting={sitename: siteName,logo: Logo,icon: Icon,tagName: TagName,appurl:AppURL};
        console.log('employee =>'+JSON.stringify(SiteSetting));
        Employee.setSiteSetting(SiteSetting).then(res =>{
          setSiteName('')
          setLogo('')
          setIcon('')
          setTagName('')
          setAppURL('')

        })
        
    }


    




  return (

    <div id="content-wrapper" class="d-flex flex-column samp" style={{ marginLeft: "13rem" }}>

        <Sidebar />
      <div className="container-fluid"   >
        <div className='container2'>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item text-white">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Site Settings</li>
        </ol>
        <div className="card md-8" style={{margin:'0px', maxWidth: '91rem',padding: '0px'}}>
          <div className="container card-body">
          <div class="temp">
          <div class="col col-lg-2">
            < Setting_sidebar />
        </div>
        <div class="col col-lg-9">
        <ul className='breadcrumb-item' style={{paddingLeft: '0px'}}>
        <form onSubmit="" method="post" className="registration-form">
        <div className="temp">
        <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Site Name
              </label>
              <input type="text" placeholder="Site Name" name="Site Name" value={siteName} onChange={changeSiteNameHandler} />
                                    
            </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label className="custom-label">
              App URL
              </label>
              <input type="text" placeholder="App URL" name="App URL" value={AppURL} onChange={changeAppURLHandler} />
              
            </div>
          </div>
          <div className="col-md-6">
        <div className="form-group">
              <label className="custom-label">
              Tag Name
              </label>
              <input type="text" placeholder="Tag Name" name="Tag Name" value={TagName} onChange={changeTagNameHandler} />
            </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label className="custom-label">
              Icon
              </label>
              <input type="text" placeholder="Icon" name="Icon" value={Icon} onChange={changeIconHandler} />
            </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label className="custom-label">
              Logo
              </label>
              <input type="text" placeholder="Logo" name="Logo" value={Logo} onChange={changeLogoHandler} />
            </div>
          </div>
          <div className="col-md-12">
         
          <div className="form-group" style={{textAlign:'center'}}>
          <input type="submit" className="btn btn-info" name="submit" value="Submit" onClick={saveEmployee} />
               
               </div>
          </div>
        </div>
        </form>
        </ul>
        </div>
        </div>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};
export default Setting;
