import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Languages = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.themoviedb.org/3/configuration/languages?api_key=4a3be2203ea40ced49f144e93997c7aa")
      .then((res) => {
        setLanguages(res.data);
        setFilteredLanguages(res.data);
      });
  }, []);

  const fetchMovies = (language, pageNum = 1, append = false) => {
    if (!language) return;

    axios
      .get(`https://api.themoviedb.org/3/discover/movie?api_key=4a3be2203ea40ced49f144e93997c7aa&with_original_language=${language}&page=${pageNum}`)
      .then((res) => {
        if (res.data.results.length > 0) {
          setMovies(append ? [...movies, ...res.data.results] : res.data.results);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      });
  };

  useEffect(() => {
    if (selectedLanguage) {
      fetchMovies(selectedLanguage);
      setPage(1);
    }
  }, [selectedLanguage]);

  const loadMoreMovies = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(selectedLanguage, nextPage, true);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLanguages(languages);
    } else {
      setFilteredLanguages(
        languages.filter((lang) =>
          lang.english_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, languages]);

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl mb-4">Select a Language</h2>

      <div className="relative">
        <input
          type="text"
          placeholder="Search languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          className="p-2 w-full border rounded text-white cursor-pointer "
        />

        {dropdownOpen && (
          <ul className="absolute w-full bg-[#141414] text-white border rounded mt-1 max-h-48 overflow-y-auto z-10">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <li
                  key={lang.iso_639_1}
                  onClick={() => {
                    setSelectedLanguage(lang.iso_639_1);
                    setSearchTerm(lang.english_name);
                    setDropdownOpen(false);
                  }}
                  className="p-2 cursor-pointer"
                >
                  {lang.english_name}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>

      {movies.length > 0 && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="cursor-pointer"
                onClick={() => navigate(`/specificationTV/${movie.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg shadow-md transition-transform transform hover:scale-105"
                />
                <p className="text-center text-sm mt-2">{movie.title}</p>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button onClick={loadMoreMovies} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Languages;
