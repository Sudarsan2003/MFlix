import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Home from './pages/Home.jsx'

import TvShows from './pages/TvShows.jsx'
import Movies from './pages/Movies.jsx'
import SpecificationTv from './components/Cards/SpecificationTv.jsx'
import SpecificationShows from './components/Cards/SpecificationShows.jsx'
import WatchList from './pages/WatchList.jsx'
import Languages from './pages/Languages.jsx'
import { useState } from 'react'
import Registration from './pages/Registration.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <BrowserRouter>
    <Navbar setSearchQuery={setSearchQuery}/>
     <Routes>
      <Route path='/' element={<Home  searchQuery={searchQuery}/>}/>
      <Route path="/tvshows" element={<TvShows searchQuery={searchQuery} />} />
      <Route path="/movies" element={<Movies searchQuery={searchQuery} />} />
      <Route path='/specificationTV/:id' element={<SpecificationTv/>}/>
      <Route path='/specificationShows/:id' element={<SpecificationShows/>}/>
      <Route path='/watchList' element={<WatchList/>}/>
      <Route path='/bylanguages' element={<Languages/>}  />
      <Route path='/registration' element={<Registration/>}  />
      <Route path='/login' element={<Login/>}  />
      <Route path='/profile' element={<Profile/>}/>
     </Routes>
    </BrowserRouter>    
  )
}

export default App