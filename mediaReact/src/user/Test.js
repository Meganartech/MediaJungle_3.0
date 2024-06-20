import React, { useState, useEffect } from 'react';
import { Link, Route  } from 'react-router-dom';
import Usersidebar from './usersidebar'
import { useNavigate } from 'react-router-dom';
import Video from './video';
import Footer from './Footer';
import API_URL from '../Config';

export const Test = () => {
    const [image, setImage] = useState([]);
    const [vimage, setvImage] = useState([]);
    // const [audios, setAudios] = useState([]);
    const navigate = useNavigate();
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [filename, setFilename] = useState(null);
    const [getall, setGetall] = useState(null);
    const [all, setall] = useState(null);
    const [items, setItems] = useState([]);
    const log=localStorage.getItem('login');  
    const userid = sessionStorage.getItem('userId')
    useEffect(() => {
      fetchData();
    }, [deleteStatus]);
  
    useEffect(() => {
     
  
      // fetch category data from the backend
      fetch(`${API_URL}/api/videogetall`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setall(data);
      // console.log(data)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  
    fetchData();
  
  
    }, []);
  
    
  
    const fetchData = async () => {
      
  
      // ------------------------------------------------------------------------------------
      try {
        // Fetch image data
        const response = await fetch(`${API_URL}/api/GetvideoThumbnail`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data && Array.isArray(data)) {
          setvImage(data);
          // console.log(data);
        } else {
          console.error('Invalid or empty data received:', data);
        }
      } catch (error) {
        console.error('Error fetching or processing image data:', error);
      }
    };
  
    const Navigation = (Id) => {
        // Set localStorage item
        localStorage.setItem('items', Id);
        const items = localStorage.getItem('items');
        // console.log(items); // Log the updated value of items
        // Navigate to the desired route
        navigate('/admin/Watch');
    };
    const handlEdit = async (Id) => {
      localStorage.setItem('items', Id);
      // navigate("/play");
    };

    useEffect(() => {
      console.log(deleteStatus);
    }, [deleteStatus]);
  
  
  
  
  return (
<div>
<section class="work_user" style={{background: "none"}}>
<div className='Wording_user'>
Movies
</div>
<div className=' grid_1_user' style={{width:"auto"}}>
{/* <div className="scroll__container"> */}
{
all && all.length > 0 ? (
all.map((get, index) => (


<Link className="Link" onClick={() => handlEdit(get.id)} to={userid ?`/watchpage/${get.moviename}`:"/UserLogin"}>
<div class="col-lg-2 col-md-2 col-sm-2 col-2 wo_u work__item_user">

    <img src={`data:image/png;base64,${vimage[index]}`} class="im_u"   alt={`Image ${index + 1}`} />
    <div class="work__item__hover_user">
        <h4>{get.moviename}</h4>
        <ul>
        <h4> <li>{get.category}</li></h4>
        <h4>  <li>{get.language}</li></h4>
        </ul>
    </div>
    
</div>
</Link>
))
)
: (
<p>No audios found.admin</p>
)
}

{/* </div> */}

{/* </div> */}
</div>
</section>
{/* <Footer/> */}
     </div>



// </div>
// </div>
  )
}
export default Test;
