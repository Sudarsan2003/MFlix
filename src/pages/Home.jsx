import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackdropCarousel from "../components/Carousel/BackdropCarousel";
import PopularCarousel from "../components/Carousel/PopularCarousel";
import TvShowsCarousel from "@/components/Carousel/TvShowsCarousel";
import TopRatedTvShows from "../components/Carousel/TopRatedTvShows";
import TrendingTvShows from "../components/Carousel/TrendingTvShows";
import TrendingMovies from "@/components/Carousel/TrendingMovies";

const API_KEY = "4a3be2203ea40ced49f144e93997c7aa";

const Home = ({ searchQuery }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);
  const [trendingTvShows, setTrendingTvShows] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length > 0) {
      const fetchMovies = axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`);
      const fetchTvShows = axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${searchQuery}`);

      Promise.all([fetchMovies, fetchTvShows])
        .then(([moviesRes, tvRes]) => {
          // Mark each result with a media type
          const movies = moviesRes.data.results.map(item => ({ ...item, media_type: "movie" }));
          const tvShows = tvRes.data.results.map(item => ({ ...item, media_type: "tv" }));

          // Combine results
          setSearchResults([...movies, ...tvShows]);
        })
        .catch((error) => console.error("Error fetching search results:", error));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then((res) => setPopularMovies(res.data.results));
    
    axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`)
      .then((res) => setPopularTvShows(res.data.results));
  }, []);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`)
      .then((res) => setTopRatedTvShows(res.data.results));
  }, []);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`)
      .then((res) => setTrendingTvShows(res.data.results));
  }, []);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
      .then((res) => setTrendingMovies(res.data.results));
  }, []);
  const handleNavigation = (item) => {
    if (item.media_type === "movie") {
      navigate(`/specificationTv/${item.id}`);
    } else {
      navigate(`/specificationShows/${item.id}`);
    }
  };

  return (
    <div className="h-screen text-white w-full">
      {searchQuery ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Search Results for: {searchQuery}</h1>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((item) => (
                <div key={item.id} className="cursor-pointer" onClick={() => handleNavigation(item)}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.name || item.title}
                    className="rounded-lg shadow-md transition-transform transform hover:scale-105"
                  />
                  <p className="text-center text-sm mt-2">{item.name || item.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </>
      ) : (
        <>
          {popularMovies.length > 0 && <BackdropCarousel popularMovies={popularMovies} />}
          <PopularCarousel popularMovies={popularMovies} />
          {popularTvShows.length > 0 && <TvShowsCarousel popularTvShows={popularTvShows} />}
          {topRatedTvShows.length > 0 && <TopRatedTvShows topRatedTvShows={topRatedTvShows} />}
          {trendingTvShows.length > 0 && <TrendingTvShows trendingTvShows={trendingTvShows} />}
          {trendingMovies.length > 0 && <TrendingMovies trendingMovies={trendingMovies} />}
        </>
      )}
    </div>
  );
};

export default Home;
