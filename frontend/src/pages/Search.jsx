import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSearchedAds, clearSearchedAds } from '../features/ads/adsSlice'
import { useEffect } from 'react'

export default function Search() {
  const dispatch = useDispatch()
  const { searchedAds, isLoading } = useSelector(state => state.ads)
  const [keyword, setKeyword] = useState('')
  
  const handleSearch = () => {
    if (keyword.trim() !== "") {
      dispatch(fetchSearchedAds({ keyword }))
    }
  }

  const handleClearSearch = () => {
    dispatch(clearSearchedAds())
    setKeyword('') 
  }
  

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search by title..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button 
        className="btn btn-primary mt-2" 
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {searchedAds && searchedAds.length > 0 && (
        <button 
          className="btn btn-secondary mt-2 ms-2" 
          onClick={handleClearSearch}
        >
          Clear Search
        </button>
      )}
    </div>
  )
}