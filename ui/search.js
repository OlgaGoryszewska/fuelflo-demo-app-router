'use client';

export default function Search({ placeholder }) {
  function handleSearch(value) {
    console.log('Search value:', value);
  }

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
