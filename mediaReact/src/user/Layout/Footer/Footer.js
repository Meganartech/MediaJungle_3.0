import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const [getall, setGetAll] = useState([]);
  const [contact, setContact] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    fbUrl: '',
    xUrl: '',
    youtubeUrl: '',
    linkedinUrl: ''
  });

  // Fetch site settings
  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetsiteSettings`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGetAll(data);
      })
      .catch(error => {
        console.error('Error fetching site settings:', error);
      });
  }, []);

  // Fetch social settings
  useEffect(() => {
    fetch(`${API_URL}/api/v2/social-settings`)
      .then(response => response.json())
      .then(data => {
        console.log("Social Settings Data:", data); // Debugging line
        if (data && data.length > 0) {
          const socialData = data[0];
          setSocialLinks({
            fbUrl: socialData.fbUrl || '',
            xUrl: socialData.xurl || '',
            youtubeUrl: socialData.youtubeUrl || '',
            linkedinUrl: socialData.linkedinUrl || ''
          });
          console.log(socialData)
        }
      })
      .catch(error => {
        console.error('Error fetching social settings:', error);
      });
  }, []);

  // Fetch contact settings
  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetcontactSettings`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setContact(data);
      })
      .catch(error => {
        console.error('Error fetching contact settings:', error);
      });
  }, []);

  const Links = [
    {
      title: 'Company',
      links: [
        { name: 'Movies', link: '/MoviesPage' },
        { name: 'Music', link: '/MusicPage' },
        { name: 'About Us', link: '/AboutUs' },
        { name: 'Contact-Us', link: '/Contactus' }
      ]
    },
    {
      title: 'My Account',
      links: [
        { name: 'Profile', link: '/UserProfileScreen' },
        { name: 'Privacy Policy', link: '/PrivacyPolicy' }
      ]
    }
  ];

  return (
    <div className="bg-dry py-3 border-t-2 border-black">
      <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-10 justify-between" style={{ margin: '0 100px' }}>
        {Links.map((link, index) => (
          <div key={index} className='col-span-1 md:col-span-2 lg:col-span-3 pb-3.5 sm:pb-0'>
            <h3 className='text-lg lg:leading-7 font-bold mb-4 sm:mb-5 lg:mb-6 pb-0.5'>{link.title}</h3>
            <ul className='text-sm flex flex-col space-y-3'>
              {link.links.map((text, index) => (
                <li key={index} className='flex items-baseline'>
                  <Link to={text.link} className='text-border inline-block w-full hover:text-subMain'>
                    {text.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
          {getall.length > 0 && getall[0].logo ? (
        <div className="flex flex-col items-center">
  <Link to="/" className="flex justify-center">
    <img
      src={`data:image/png;base64,${getall[0].logo}`}
      alt="logo"
      className="w-1/2 h-25"
    />
  </Link>

  <div className="flex space-x-4 mt-4 justify-center">
    {socialLinks.fbUrl && (
      <a href={socialLinks.fbUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faFacebookF} className="text-blue-600 text-2xl" />
      </a>
    )}
    {socialLinks.xUrl && (
      <a href={socialLinks.xUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faTwitter} className="text-blue-400 text-2xl" />
      </a>
    )}
    {socialLinks.youtubeUrl && (
      <a href={socialLinks.youtubeUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faYoutube} className="text-red-600 text-2xl" />
      </a>
    )}
    {socialLinks.linkedinUrl && (
      <a href={socialLinks.linkedinUrl} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedinIn} className="text-blue-700 text-2xl" />
      </a>
    )}
  </div>
</div>

       
          ) : (
            <div></div>
          )}
          {contact.length > 0 &&
            <p className="leading-7 text-sm text-border mt-3">
              <span>{contact[0].contact_address}</span><br />
              <span>{contact[0].contact_mobile}</span><br />
              <span>{contact[0].contact_email}</span>
            </p>
          }
        </div>
        <div className="flex flex-col mt-4 space-y-4 justify-center">
  <a href="" target="_blank" className="w-full" rel="noopener noreferrer">
    <button className="bg-black text-white rounded w-full">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
        alt="Get it on Google Play"
        className="w-full h-08"
      />
    </button>
  </a>

  <a href="" target="_blank" className="w-full" rel="noopener noreferrer">
    <button className="bg-black text-white rounded w-full">
      <img
        src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1522022400"
        alt="Download on the App Store"
        className="w-full h-08"
      />
    </button>
  </a>
</div>

      </div>
    </div>
  );
}

export default Footer;
