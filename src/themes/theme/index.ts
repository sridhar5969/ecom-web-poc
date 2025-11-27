// ==============================|| PRESET THEME - THEME SELECTOR ||============================== //

import { darken, lighten } from '@mui/material';

interface ColorPalette {
	gold: string[];
	cyan: string[];
	green: string[];
	grey: string[];
	red: string[];
	yellow: string[];
}

const Theme = (colors: ColorPalette) => {
	const { gold, cyan, green, grey, red, yellow } = colors;
	const greyColors = {
		0: grey[0],
		50: grey[1],
		100: grey[2],
		200: grey[3],
		300: grey[4],
		400: grey[5],
		500: grey[6],
		600: grey[7],
		700: grey[8],
		800: grey[9],
		900: grey[10],
		A50: grey[15],
		A100: grey[11],
		A200: grey[12],
		A400: grey[13],
		A700: grey[14],
		A800: grey[16]
	};
	const yellowColors = {
		0: yellow[0],
		50: yellow[1],
		100: yellow[2],
		200: yellow[3],
		300: yellow[4],
		400: yellow[5],
		500: yellow[6],
		600: yellow[7],
		700: yellow[8],
		800: yellow[9],
		900: yellow[10],
		A50: yellow[15],
		A100: yellow[11],
		A200: yellow[12],
		A400: yellow[13],
		A700: yellow[14],
		A800: yellow[16]
	};
	const contrastText = '#fff';

	// Extracted from the "Add to Cart" button and Logo
	const primaryBaseColor = '#E53935'; // Tolaram Red

	// Extracted from the Top Navigation Bar
	const secondaryBaseColor = '#232F3E'; // Deep Navy/Slate

	// Utility functions to generate shades
	const generateShades = (color: string) => ({
		lighter: lighten(color, 0.85),
		100: lighten(color, 0.7),
		200: lighten(color, 0.5),
		light: lighten(color, 0.25),
		400: lighten(color, 0.15),
		main: color,
		dark: darken(color, 0.2),
		700: darken(color, 0.3),
		darker: darken(color, 0.4),
		900: darken(color, 0.5),
		contrastText: '#ffffff'
	});

	const primaryShades = generateShades(primaryBaseColor);
	const secondaryShades = generateShades(secondaryBaseColor);

	return {
		primary: {
			lighter: primaryShades.lighter,
			100: primaryShades[100],
			200: primaryShades[200],
			light: primaryShades.light,
			400: primaryShades[400],
			main: primaryShades.main,
			dark: primaryShades.dark,
			700: primaryShades[700],
			darker: primaryShades.darker,
			900: primaryShades[900],
			contrastText: primaryShades.contrastText
		},
		secondary: {
			lighter: secondaryShades.lighter,
			100: secondaryShades[100],
			200: secondaryShades[200],
			light: secondaryShades.light,
			400: secondaryShades[400],
			main: secondaryShades.main,
			dark: secondaryShades.dark,
			700: secondaryShades[700],
			darker: secondaryShades.darker,
			900: secondaryShades[900],
			contrastText: secondaryShades.contrastText
		},
		error: {
			lighter: '#ffebee',
			light: '#ef5350',
			main: '#d32f2f', // Standard Red for errors
			dark: '#c62828',
			darker: '#b71c1c',
			contrastText
		},
		warning: {
			lighter: '#fff8e1',
			light: '#ffecb3',
			main: '#ffca28', // Yellow stars color
			dark: '#ffb300',
			darker: '#ff6f00',
			contrastText: greyColors[100]
		},
		success: {
			lighter: '#e8f5e9',
			light: '#81c784',
			main: '#2e7d32', // The "In Stock" Green
			dark: '#1b5e20',
			darker: '#003300',
			contrastText
		},
		// info: {
		// 	lighter: cyan[0],
		// 	light: cyan[3],
		// 	main: cyan[5],
		// 	dark: cyan[7],
		// 	darker: cyan[9],
		// 	contrastText
		// },
		grey: greyColors,
		yellow: yellowColors,
		status: {
			pending: '#FEF8E8',
			accepted: '#48D7B9',
			rejected: '#F9789A'
		},
		custom: {
			bestseller: '#2196F3', // Blue tag
			lush: '#9C27B0', // Purple tag
			instant: '#E53935' // Red tag
		},
		text: {
			primary: greyColors[900], // Darker text for headings
			secondary: greyColors[600], // Lighter text for descriptions
			disabled: greyColors[400]
		},
		background: {
			paper: '#ffffff',
			default: '#F4F6F8' // Light grey background seen behind cards
		}
	};
};

export default Theme;
