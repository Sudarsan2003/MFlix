import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";

const PopularCarousel = ({ popularMovies }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-6 px-4 md:px-6">
      <h1 className="text-xl md:text-2xl mb-5 ml-2 md:ml-5 font-semibold">
        Popular Movies
      </h1>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 2.2, spaceBetween: 8 },  
          480: { slidesPerView: 3, spaceBetween: 10 },   
          640: { slidesPerView: 3.5, spaceBetween: 12 }, 
          768: { slidesPerView: 4, spaceBetween: 15 },   
          1024: { slidesPerView: 5, spaceBetween: 18 },  
          1280: { slidesPerView: 6, spaceBetween: 20 }, 
        }}
        className="w-full p-2"
      >
        {popularMovies.map((item, index) => (
          <SwiperSlide key={index} className="flex justify-center min-w-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              className="rounded-lg shadow-lg object-cover max-w-full h-auto w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => navigate(`/specificationTV/${item.id}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularCarousel;
