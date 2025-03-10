import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaPlay, FaTimes, FaInfoCircle, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "../components/Redux/watchListSlice";

const TvShows = ({ searchQuery }) => {
  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);

  useEffect(() => {
    fetchTvShows();
  }, [selectedGenre]);

  useEffect(() => {
    axios
      .get("https://api.themoviedb.org/3/genre/tv/list?api_key=4a3be2203ea40ced49f144e93997c7aa")
      .then((res) => {
        setGenres(res.data.genres);
      });
  }, []);

  const fetchTvShows = () => {
    const url = selectedGenre
      ? `https://api.themoviedb.org/3/discover/tv?api_key=4a3be2203ea40ced49f144e93997c7aa&with_genres=${selectedGenre}`
      : "https://api.themoviedb.org/3/discover/tv?api_key=4a3be2203ea40ced49f144e93997c7aa";
    
    axios.get(url).then((res) => {
      setTvShows(res.data.results);
    });
  };

  const recommendShows = (show_id) => {
    axios
      .get(`https://api.themoviedb.org/3/tv/${show_id}/recommendations?api_key=4a3be2203ea40ced49f144e93997c7aa`)
      .then((res) => {
        setRecommendedShows(res.data.results);
      });
  };

  const openModal = (show) => {
    setSelectedShow(show);
    recommendShows(show.id);
  };

  const closeModal = () => {
    setSelectedShow(null);
    setRecommendedShows([]);
  };

  const isInWatchlist = selectedShow && watchlist.some(item => item.id === selectedShow.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(selectedShow.id));
    } else {
      dispatch(addToWatchlist(selectedShow));
    }
  };

  
  const filteredTvShows = tvShows.filter((show) =>
    show.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="w-full flex space-x-6">
        <h2 className="text-2xl ml-6">TV Shows</h2>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn mb-5">Genres</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {genres.map((item) => (
              <li key={item.id}>
                <a onClick={() => setSelectedGenre(item.id)}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full h-screen">
        <Swiper
          modules={[Autoplay, Navigation]}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          className="w-full h-full"
        >
          {filteredTvShows.length > 0 ? (
            filteredTvShows.map((item, index) => (
              <SwiperSlide key={index} className="relative flex items-center justify-center">
                <img
                  src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                  alt={item.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => navigate(`/specificationShows/${item.id}`)}
                />

                <div className="absolute inset-0 flex items-center p-8 text-white bg-black/50">
                  <div className="p-6 rounded-lg max-w-[50%]">
                    <h1 className="text-[60px] font-bold">{item.name}</h1>
                    <p className="text-sm mt-2">{item.overview}</p>
                    <Button className="bg-white text-black mt-5 hover:animate-bounce">
                      <FaPlay /> Play Now
                    </Button>
                    <Button
                      className="bg-white text-black mt-5 hover:animate-bounce ml-5"
                      onClick={() => openModal(item)}
                    >
                      <FaInfoCircle /> More Info
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-white text-center mt-10 text-xl">No TV Shows found.</p>
          )}
        </Swiper>
      </div>

      {selectedShow && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-[#141414] text-white w-[50%] h-[700px] rounded-lg overflow-scroll relative p-6">
            <button className="absolute top-3 right-3 text-white text-2xl" onClick={closeModal}>
              <FaTimes />
            </button>

            <img
              src={`https://image.tmdb.org/t/p/original${selectedShow.backdrop_path}`}
              alt={selectedShow.name}
              className="rounded-lg cursor-pointer"
              onClick={() => navigate(`/specificationShows/${selectedShow.id}`)}
            />

            <h2 className="text-3xl font-bold mt-4">{selectedShow.name}</h2>
            <p className="text-sm mt-3">{selectedShow.overview}</p>

            <div className="flex space-x-4 mt-5">
              <Button className="text-black bg-white">
                {selectedShow.adult ? "A" : "U/A 16+"}
              </Button>
              <Button className="text-black bg-white flex items-center" onClick={handleWatchlistToggle}>
                {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />} {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
            </div>

            <h3 className="text-xl font-semibold mt-8">Recommended Shows</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {recommendedShows.length > 0 ? (
                recommendedShows.map((rec) => (
                  <div key={rec.id} className="cursor-pointer" onClick={() => navigate(`/specificationShows/${rec.id}`)}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                      alt={rec.name}
                      className="rounded-lg shadow-md transition-transform transform hover:scale-105"
                    />
                    <p className="text-center text-sm mt-2">{rec.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No recommendations available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TvShows;
