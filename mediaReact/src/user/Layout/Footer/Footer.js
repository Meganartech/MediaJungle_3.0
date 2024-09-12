import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const [getall, setGetAll] = useState('');
  const [contact, setcontact] = useState('');

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
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/v2/GetcontactSettings`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setcontact(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const Links = [
    {
      title: 'Company',
      links: [
        {
          name: 'Movies',
          link: '/MoviesPage'
        },
        {
          name: 'Music',
          link: '/MusicPage'
        },
        {
          name: 'About Us',
          link: '/AboutUs'
        },
        {
          name: 'Contact-Us',
          link: '/Contactus'
        }
      ]
    },
    {
      title: 'My Account',
      links: [
        {
          name: 'Profile',
          link: '/UserProfileScreen'
        },
        {
          name: 'Privacy Policy',
          link: '/PrivacyPolicy'
        }
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
            <div>
              <Link to="/">
                <img
                  src={`data:image/png;base64,${getall[0].logo}`}
                  alt="logo"
                  className="w-full h-30" />
              </Link>
              <div className="flex space-x-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebookF} className="text-blue-600 text-2xl" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} className="text-blue-400 text-2xl" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faYoutube} className="text-red-600 text-2xl" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLinkedinIn} className="text-blue-700 text-2xl" />
                </a>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {contact.length > 0 ?
            <p className="leading-7 text-sm text-border mt-3">
              <span>{contact[0].contact_address}</span><br />
              <span>{contact[0].contact_mobile}</span><br />
              <span>{contact[0].contact_email}</span>
            </p>
            :
            <div></div>
          }
        </div>
        <div className="flex-col mt-4">
          <a href="https://play.google.com/store/apps" target="_blank" className='w-full' rel="noopener noreferrer">
            <button className="bg-black text-white rounded items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                alt="Get it on Google Play"
                className="w-full mr-2"
              />
            </button>
          </a>
          <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
            <button className="text-white py-2 px-4 rounded flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_Badge_EN.svg/512px-App_Store_Badge_EN.svg.png"
                alt="Download on the App Store"
                className="w-24 mr-2"
              />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
