import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "../Redux/watchListSlice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const SpecificationTv = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);
  
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=4a3be2203ea40ced49f144e93997c7aa`)
      .then((res) => {
        setMovie(res.data);
      });
  }, [id]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=4a3be2203ea40ced49f144e93997c7aa`)
      .then((res) => {
        setVideos(res.data.results);
      });
  }, [id]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}/images?api_key=4a3be2203ea40ced49f144e93997c7aa`)
      .then((res) => {
        setImages(res.data.backdrops);
      });
  }, [id]);

  const isInWatchlist = movie && watchlist.some((item) => item.id === movie.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist(movie));
    }
  };

  if (!movie) return <div className="text-white text-center text-xl">Loading...</div>;

  return (
    <div className="text-white p-5 md:p-10">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg shadow-lg w-full md:w-[300px] h-auto"
        />

        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-bold">{movie.title}</h1>
          <p className="mt-3 text-sm md:text-lg text-gray-300">{movie.overview}</p>
          <p className="mt-3"><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}/10</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
          <Button className="mt-3 text-black bg-white flex items-center px-3 py-1 text-sm" onClick={handleWatchlistToggle}>
            {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />} {isInWatchlist ? "Remove from  WatchList" : "Add to WatchList"}
          </Button>
        </div>
      </div>

      <hr className="my-8 border-gray-600" />

      <h2 className="text-xl md:text-3xl mb-5">Watch Trailer</h2>
      {videos.filter(video => video.type === "Trailer" && video.site === "YouTube").length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos
            .filter(video => video.type === "Trailer" && video.site === "YouTube")
            .map((video, index) => (
              <iframe
                key={index}
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
            ))}
        </div>
      ) : (
        <p className="text-gray-400">No trailers available.</p>
      )}
      <hr className="my-8 border-gray-600" />
    
      <h2 className="text-xl md:text-3xl mb-5">Related Images</h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((item, index) => (
          <img
            key={index}
            src={`https://image.tmdb.org/t/p/original${item.file_path}`}
            className="rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default SpecificationTv;
