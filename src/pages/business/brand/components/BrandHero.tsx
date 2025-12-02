import React from 'react';
import { Box, Container, Avatar, Typography, Paper } from '@mui/material';

interface BrandHeroProps {
	name: string;
	description: string;
	bannerUrl: string;
	logoUrl: string;
}

const BrandHero: React.FC<BrandHeroProps> = ({ name, description, bannerUrl, logoUrl }) => {
	return (
		<Paper elevation={0} sx={{ position: 'relative', mb: 8, borderRadius: 0 }}>
			{/* 1. Banner Image */}
			<Box
				sx={{
					height: { xs: 200, md: 350 },
					width: '100%',
					backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${bannerUrl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					alignItems: 'flex-end'
				}}
			/>

			<Container maxWidth="xl" sx={{ position: 'relative' }}>
				{/* 2. Floating Brand Content */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: { xs: 'center', sm: 'flex-end' },
						mt: -6, // Pull up into banner
						mb: 2,
						px: 2
					}}
				>
					{/* Brand Logo */}
					<Avatar
						src={logoUrl}
						alt={name}
						sx={{
							width: 120,
							height: 120,
							border: '4px solid white',
							bgcolor: 'white',
							boxShadow: 3
						}}
					/>

					{/* Brand Text Info */}
					<Box sx={{ ml: { sm: 3 }, mt: { xs: 2, sm: 0 }, textAlign: { xs: 'center', sm: 'left' } }}>
						<Typography variant="h3" fontWeight="800" component="h1">
							{name}
						</Typography>
						<Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600 }}>
							{description}
						</Typography>
					</Box>
				</Box>
			</Container>
		</Paper>
	);
};

export default BrandHero;
