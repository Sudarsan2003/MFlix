import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWatchlist } from "../components/Redux/watchListSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";

const Watchlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const watchlist = useSelector((state) => state.watchlist);

  const handleRemove = (movieId) => {
    dispatch(removeFromWatchlist(movieId));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Watchlist</h2>

      {watchlist.length === 0 ? (
        <p className="text-gray-400">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((movie) => (
            <div key={movie.id} className="relative flex flex-col items-center">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg shadow-md cursor-pointer"
                onClick={() => navigate(`/specificationTV/${movie.id}`)}
              />
              <Button
                className="bg-red-500 text-white flex items-center justify-center mt-2 hover:bg-red-700"
                onClick={() => handleRemove(movie.id)}
              >
                <FaTrash className="mr-2" /> Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
