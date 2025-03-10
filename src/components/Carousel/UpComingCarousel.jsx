import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const UpComingMovies = ({ upComingMovies }) => {
  const navigate = useNavigate();
  const handleMovieClick = (id) => {
    navigate(`/specificationTv/${id}`);
  };

  return (
    <div className="w-full mt-6 px-3 sm:px-6 lg:px-8">
      <h1 className="text-lg sm:text-2xl mb-3 sm:mb-5 font-semibold">Upcoming Movies</h1>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        navigation
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 2.2, spaceBetween: 8 },  
          480: { slidesPerView: 3, spaceBetween: 10 },   
          640: { slidesPerView: 3.5, spaceBetween: 12 },
          768: { slidesPerView: 4, spaceBetween: 15 },   
          1024: { slidesPerView: 5, spaceBetween: 18 }, 
          1280: { slidesPerView: 6, spaceBetween: 20 }, 
        }}
        className="h-[180px] sm:h-[220px] md:h-[250px] w-full p-2 sm:p-5"
      >
        {upComingMovies.map((item, index) => (
          <SwiperSlide key={index} className="flex justify-center cursor-pointer">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              className="rounded-lg shadow-lg object-cover w-[100px] sm:w-[130px] md:w-[150px] h-[150px] sm:h-[180px] md:h-[220px] hover:scale-105 transition"
              onClick={() => handleMovieClick(item.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UpComingMovies;
