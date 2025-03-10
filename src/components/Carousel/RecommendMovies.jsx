import React, { use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const RecommendedMovies = ({ recommendMovies}) => {
  const navigate=useNavigate();
  return (
    <div className="w-full mt-6">
      <h1 className="text-2xl mb-5 ml-5 ">Top Rated TvShows</h1>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={6}  
        navigation  
        autoplay={{ delay: 3000 }}  
        className="h-[250px] w-full p-5" 
      >
        {recommendMovies.map((item, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              className="rounded-lg shadow-lg object-cover w-[150px] h-[220px]"
              onClick={() => navigate(`/specificationTV/${movie.id}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecommendedMovies;
