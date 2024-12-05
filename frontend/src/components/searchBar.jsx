import React from 'react';
import { useState } from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [debounce, setDebounce] = useState(null) 
  const [queryInput, setQueryInput] = useState('');
  return (
    <input
      type="text"
      placeholder="Search by name or category"
      className="w-full min-[450px]:w-3/4 p-2 border border-gray-300 rounded "
      value={queryInput}
      onChange={(e) => {
        setQueryInput(e.target.value)
        if(debounce) clearTimeout(debounce)
        setDebounce(setTimeout(() => setSearchQuery(e.target.value), 500))
        // setSearchQuery(e.target.value) 
      }}
    />
  );
};

export default SearchBar;
