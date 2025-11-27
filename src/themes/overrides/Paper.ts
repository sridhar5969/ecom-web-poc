import { Theme } from '@mui/material/styles';

export default function Paper(theme: Theme) {
	return {
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none' // Remove default MUI dark mode gradients if applicable
				},
				rounded: {
					borderRadius: 12 // Matches the product cards
				},
				elevation1: {
					boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' // Very subtle shadow
				}
			}
		}
	};
}
