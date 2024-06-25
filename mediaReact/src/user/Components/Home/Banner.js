import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import FlexMovieItems from '../FlexMovieItems';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';

const Banner = () => {
    const [all, setAll] = useState(null);
    const [vimage, setVImage] = useState([]);
    const log = localStorage.getItem('login');
    const userid = sessionStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchAllMovies();
    }, []);

    const fetchAllMovies = async () => {
        try {
            const response = await fetch(`${API_URL}/api/videogetall`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAll(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/GetvideoThumbnail`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data)) {
                setVImage(data);
                console.log("thumbnail",data)
            } else {
                console.error('Invalid or empty data received:', data);
            }
        } catch (error) {
            console.error('Error fetching or processing image data:', error);
        }
    };

    const handlePage = (Id, moviename) => {
        if (userid) {
            localStorage.setItem('items', Id);
            navigate(`/watchpage/${moviename}`);
        } else {
            navigate("/UserLogin");
        }
    };

    return (
        <div className='relative w-full xl:h-96 bg-dry lg:h-64 h-48 overflow-hidden'>
            <Swiper
                direction='vertical'
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                speed={1000}
                modules={[Autoplay]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className='w-full xl:h-96 bg-dry lg:h-64 h-48'
            >
                {
                    all && all.length > 0 ? (all.slice(0, 8).map((movie, index) => (
                        <SwiperSlide key={index} className='relative rounded overflow-hidden' style={{ overflow: "hidden" }}>
                            <img src={`data:image/png;base64,${vimage[index]}`} alt={movie.title} className='w-full h-200 object-cover' />
                            <div className='absolute linear-bg xl:pl-52 sm:pl-32 pl-8 top-0 bottom-0 right-0 left-0 flex flex-col justify-center lg:gap- md:gap-5 gap-4'>
                                <h1 className='xl:text-4xl truncate capitalize font-sans sm:text-2xl text-xl font-bold'>
                                    {movie.moviename}
                                </h1>
                                <div className='flex gap-5 items-center text-dryGray'>
                                    <FlexMovieItems movie={movie} />
                                </div>
                                <div className='flex gap-5 items-center'>
                                    <button
                                        className="bg-subMain hover:text-main transitions text-white px-8 py-3 rounded font-medium sm:text-sm text-xs"
                                        onClick={() => handlePage(movie.id, movie.moviename)}
                                    >
                                        Watch
                                    </button>
                                    <button className='hover:text-subMain'>
                                        <FaHeart />
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))) : (<div></div>)
                }
            </Swiper>
        </div>
    );
}

export default Banner;
