/**
 * Search Bar Component
 * Real-time client-side filtering across event fields
 */

import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function SearchBar({ value, onChange, placeholder = 'Search events...' }) {
  return (
    <TextField
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}