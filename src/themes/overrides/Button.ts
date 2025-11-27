// src/themes/overrides/Button.ts
import { Theme } from '@mui/material/styles';

export default function Button(theme: Theme) {
	return {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8, // Soft rounded corners like the image
					fontWeight: 600
				},
				contained: {
					boxShadow: 'none',
					'&:hover': {
						boxShadow: 'none'
					}
				},
				sizeLarge: {
					height: 48 // Taller buttons for "Add to Cart"
				}
			}
		}
	};
}
