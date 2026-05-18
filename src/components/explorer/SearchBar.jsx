/**
 * Search Bar Component
 * Real-time client-side filtering across event fields
 */

export function SearchBar({ value, onChange, placeholder = 'Search events...' }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}