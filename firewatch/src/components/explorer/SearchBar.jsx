import { Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function SearchBar({ value, onChange, placeholder = 'Search events...' }) {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <SearchIcon
        sx={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          fontSize: 20,
          pointerEvents: 'none',
        }}
      />
      <TextField
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="small"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            bgcolor: 'var(--color-surface)',
            '& fieldset': { borderColor: 'var(--color-border)' },
            '&:hover fieldset': { borderColor: 'var(--color-text-muted)' },
            '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
          },
          '& .MuiInputBase-input': {
            color: 'var(--color-text-primary)',
            pl: 4.5,
          },
        }}
      />
    </Box>
  );
}