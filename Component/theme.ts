'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    direction: 'rtl',
    cssVariables: true,
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily: 'var(--font-cairo)',
    },
});

export default theme;
