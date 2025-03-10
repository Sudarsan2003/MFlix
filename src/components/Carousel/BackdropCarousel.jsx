import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import { FaInfoCircle, FaPlay, FaTimes, FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "../Redux/watchListSlice";

const BackdropCarousel = ({ popularMovies }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);

  const recommendMovies = (movie_id) => {
    axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=4a3be2203ea40ced49f144e93997c7aa`)
      .then((res) => {
        setRecommendedMovies(res.data.results);
      });
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    recommendMovies(movie.id);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRecommendedMovies([]);
  };

  const isInWatchlist = selectedMovie && watchlist.some((item) => item.id === selectedMovie.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(selectedMovie.id));
    } else {
      dispatch(addToWatchlist(selectedMovie));
    }
  };

  return (
    <>
      <div className="w-full h-[60vh] md:h-screen relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
        >
          {popularMovies.map((item, index) => (
            <SwiperSlide key={index} className="relative w-full h-full">
              {item.backdrop_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                  No Image Available
                </div>
              )}

              <div className="absolute inset-0 flex items-center p-4 sm:p-6 md:p-8 lg:p-12 text-white">
                <div className="p-4 sm:p-6 md:p-8 lg:p-12rounded-lg max-w-[90%] md:max-w-[60%] lg:max-w-[50%]">
                  <h1 className="text-2xl md:text-4xl lg:text-[60px] font-bold">{item.title}</h1>
                  <p className="text-xs md:text-sm lg:text-base mt-2">{item.overview}</p>
                  <div className="flex space-x-4 mt-5">
                    <Button className="bg-white text-black text-sm sm:text-base">
                      <FaPlay /> Play Now
                    </Button>
                    <Button className="bg-white text-black text-sm sm:text-base" onClick={() => openModal(item)}>
                      <FaInfoCircle /> More Info
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selectedMovie && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#141414] text-white w-[90%] md:w-[60%] lg:w-[50%] h-[90vh] md:h-[700px] rounded-lg overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-white text-2xl"
              onClick={closeModal}
            >
              <FaTimes />
            </button>

            <div className="p-4 sm:p-6">
              <img
                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                alt={selectedMovie.title}
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-lg object-cover cursor-pointer"
                onClick={() => navigate(`/specificationTV/${selectedMovie.id}`)}
              />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4">{selectedMovie.title}</h2>
              <p className="text-xs sm:text-sm mt-3">{selectedMovie.overview}</p>
              <div className="flex gap-3 mt-5">
                <Button className="text-black bg-white text-sm sm:text-base">
                  {selectedMovie.adult ? "A" : "U/A 16+"}
                </Button>
                <Button
                  className="text-black bg-white flex items-center px-3 py-1 text-sm sm:text-base"
                  onClick={handleWatchlistToggle}
                >
                  {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />} {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </Button>
              </div>

              {recommendedMovies.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">Recommended Movies</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {recommendedMovies.slice(0, 4).map((movie) => (
                      <div 
                        key={movie.id} 
                        className="relative cursor-pointer" 
                        onClick={() => navigate(`/specificationTV/${movie.id}`)} 
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="rounded-lg shadow-md"
                        />
                        <p className="text-center mt-2 text-sm">{movie.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BackdropCarousel;
