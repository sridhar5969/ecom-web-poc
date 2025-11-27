// ==============================|| DEFAULT THEME - TYPOGRAPHY  ||============================== //

const Typography = (fontFamily: string) => ({
	htmlFontSize: 16,
	fontFamily,
	fontWeightLight: 300,
	fontWeightRegular: 400,
	fontWeightMedium: 500,
	fontWeightBold: 600,
	h1: {
		fontWeight: 700, // Bolder
		fontSize: '2.375rem',
		lineHeight: 1.21
	},
	h2: {
		fontWeight: 700,
		fontSize: '1.875rem',
		lineHeight: 1.27
	},
	h3: {
		fontWeight: 600,
		fontSize: '1.5rem', // Product Titles on PDP
		lineHeight: 1.33
	},
	h4: {
		fontWeight: 600,
		fontSize: '1.25rem', // "Featured Products"
		lineHeight: 1.4
	},
	h5: {
		fontWeight: 600,
		fontSize: '1rem', // Product Titles on Cards
		lineHeight: 1.5
	},
	h6: {
		fontWeight: 600, // Price needs to be bold
		fontSize: '0.875rem',
		lineHeight: 1.57
		// color: '#E53935' // Optional: Default H6 to red if mostly used for price
	},
	caption: {
		fontWeight: 400,
		fontSize: '0.75rem',
		lineHeight: 1.66
	},
	body1: {
		fontSize: '0.875rem',
		lineHeight: 1.57
	},
	body2: {
		fontSize: '0.75rem',
		lineHeight: 1.66
	},
	subtitle1: {
		fontSize: '0.875rem',
		fontWeight: 600,
		lineHeight: 1.57
	},
	subtitle2: {
		fontSize: '0.75rem',
		fontWeight: 500,
		lineHeight: 1.66
	},
	overline: {
		lineHeight: 1.66
	},
	button: {
		textTransform: 'capitalize' as const, // The buttons in UI are "Add to Cart", not "ADD TO CART"
		fontWeight: 500
	}
});

export default Typography;
