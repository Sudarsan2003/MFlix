import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "@/components/ui/button";
import { FaInfoCircle, FaPlay, FaTimes, FaBookmark, FaRegBookmark } from "react-icons/fa";
import UpComingMovies from "@/components/Carousel/UpComingCarousel";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "../components/Redux/watchListSlice";

const Movies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);

  const [movies, setMovies] = useState([]);
  const [upComingMovies, setUpComingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  useEffect(() => {
    axios.get("https://api.themoviedb.org/3/discover/movie?api_key=4a3be2203ea40ced49f144e93997c7aa")
      .then((res) => {
        setMovies(res.data.results);
      });
  }, []);

  useEffect(() => {
    axios.get("https://api.themoviedb.org/3/movie/upcoming?api_key=4a3be2203ea40ced49f144e93997c7aa")
      .then((res) => {
        setUpComingMovies(res.data.results);
      });
  }, []);

  useEffect(() => {
    axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=4a3be2203ea40ced49f144e93997c7aa")
      .then((res) => {
        setGenres(res.data.genres);
      });
  }, []);

  const fetchMoviesByGenre = (genreId) => {
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=4a3be2203ea40ced49f144e93997c7aa&with_genres=${genreId}`)
      .then((res) => {
        setMovies(res.data.results);
      });
    setSelectedGenre(genreId);
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=4a3be2203ea40ced49f144e93997c7aa`)
      .then((res) => {
        setRecommendedMovies(res.data.results);
      });
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setRecommendedMovies([]);
  };

  const isInWatchlist = selectedMovie && watchlist.some(movie => movie.id === selectedMovie.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(selectedMovie.id));
    } else {
      dispatch(addToWatchlist(selectedMovie));
    }
  };

  return (
    <>
      <div className="w-full flex space-x-6 p-6">
        <h2 className="text-2xl">Movies</h2>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn">Genres</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {genres.map((genre) => (
              <li key={genre.id} onClick={() => fetchMoviesByGenre(genre.id)}>
                <a>{genre.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!selectedGenre && (
        <div className="w-full h-screen">
         <Swiper
  modules={[Autoplay, Navigation]}
  slidesPerView={1}
  autoplay={{ delay: 3000, disableOnInteraction: false }}
  navigation
  className="w-full h-[50vh] sm:h-[60vh] md:h-[100vh] lg:h-[100vh] xl:h-[100vh]"
  breakpoints={{
    640: { slidesPerView: 1 },
    768: { slidesPerView: 1 },
    1024: { slidesPerView: 1 },
  }}
>
  {movies.slice(0, 5).map((item, index) => (
    <SwiperSlide key={index} className="relative">
      <img
        src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center p-8 text-white bg-black/50">
        <div className="p-6 rounded-lg max-w-[80%] md:max-w-[50%]">
          <h1 className="text-xl md:text-3xl lg:text-[60px] font-bold">{item.title}</h1>
          <p className="text-xs md:text-sm mt-2">{item.overview}</p>
          <Button className="bg-white text-black mt-5">
            <FaPlay /> Play Now
          </Button>
          <Button className="bg-white text-black mt-5 ml-5" onClick={() => openModal(item)}>
            <FaInfoCircle /> More Info
          </Button>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>

        </div>
      )}


      <div className="p-6">
        <h3 className="text-2xl font-bold">{selectedGenre ? "Movies by Genre" : "Popular Movies"}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {movies.map((movie) => (
            <div key={movie.id} className="cursor-pointer" onClick={() => openModal(movie)}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg shadow-md transition-transform transform hover:scale-105"
              />
              <p className="text-center text-sm mt-2">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

     
      {selectedMovie && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#141414] text-white w-[50%] h-[700px] rounded-lg overflow-scroll relative">
            <button className="absolute top-3 right-1 text-white text-2xl" onClick={closeModal}>
              <FaTimes />
            </button>
            <div className="p-6">
              <img
                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                alt={selectedMovie.title}
                className="rounded-lg cursor-pointer"
                onClick={() => navigate(`/specificationTV/${selectedMovie.id}`)}
              />
              <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
              <p className="text-sm mt-3">{selectedMovie.overview}</p>
               <div className="flex space-x-4 mt-5">
                      <Button className="text-black bg-white">
                        {selectedMovie.adult ? "A" : "U/A 16+"}
                      </Button>
                      <Button className="text-black bg-white flex items-center" onClick={handleWatchlistToggle}>
                        {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />} {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                      </Button>
                    </div>

              <h3 className="text-xl font-semibold mt-8">Recommended Movies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {recommendedMovies.map((rec) => (
                  <div key={rec.id} onClick={() => navigate(`/specificationTV/${rec.id}`)}>
                    <img src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`} className="rounded-lg shadow-md hover:scale-105" />
                    <p className="text-center text-sm mt-2">{rec.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {upComingMovies.length > 0 && <UpComingMovies upComingMovies={upComingMovies} />}
    </>
  );
};

export default Movies;
