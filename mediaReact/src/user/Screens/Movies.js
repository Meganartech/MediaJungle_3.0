import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Head from '../Components/Head';
import Filters from '../Components/Filters';
import API_URL from '../../Config';

const MoviesPage = () => {
  const maxPage = 5;
  const log = localStorage.getItem('login');
  const [page, setPage] = useState(maxPage);
  const [vimage, setvImage] = useState([]);
  const [all, setall] = useState(null);
  const userid = sessionStorage.getItem('userId');

  const HandleLoadingMore = () => {
    setPage(page + maxPage);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/v2/videogetall`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setall(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    fetchData();
  }, []);

  const handlEdit = async (Id) => {
    localStorage.setItem('items', Id);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v2/GetvideoThumbnail`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data)) {
        setvImage(data);
      } else {
        console.error('Invalid or empty data received:', data);
      }
    } catch (error) {
      console.error('Error fetching or processing image data:', error);
    }
  };

  return (
    <Layout>
      <div
        className='mx-auto min-h-screen px-10'
        style={{
          background: 'linear-gradient(to bottom, #141335, #0c0d1a)', // Gradient background applied here
        }}
      >
        <div className="px-2 mb-6">
          <Filters />
          
          <p className='text-lg font-medium'>
            Total <span className='font-bold text-subMain'>{all && all.length > 0 ? all.length : "none"}</span> items Found
          </p>

          <div
            className='grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6'
            style={{ height: "auto !important" }}
          >
            {all && all.length > 0 ? (
              all.slice(0, all.length).map((movie, index) => (
                <div key={index} className="slider-item">
                  <div className='border border-border p-1 hover:scale-95 transitions relative rounded overflow-hidden' style={{ height: "16rem" }}>
                    <Link to={userid ? `/watchpage/${movie.moviename}` : "/UserLogin"} onClick={() => handlEdit(movie.id)} className='w-full'>
                      <img
                        src={`data:image/png;base64,${vimage[index]}`}
                        alt={movie?.name}
                        className='w-full h-64 object-cover'
                      />
                    </Link>
                    <div className='absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3'>
                      <h3 className='font-semibold truncate'>{movie.moviename}</h3>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MoviesPage;
