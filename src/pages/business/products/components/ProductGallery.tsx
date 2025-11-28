import React, { useState } from 'react';
import { Box } from '@mui/material';
import { getFallbackImage } from '../utils/getFallbackImage';

interface GalleryProps {
	images?: Array<{ id: string; url: string }>;
	title: string;
}

const ProductGallery: React.FC<GalleryProps> = ({ images, title }) => {
	//  Ensure we always have at least 3 images
	const safeImages =
		images?.length && images[0]?.url
			? images
			: [
					{ id: 'fallback-1', url: getFallbackImage() },
					{ id: 'fallback-2', url: getFallbackImage() },
					{ id: 'fallback-3', url: getFallbackImage() }
				];

	const [selectedImage, setSelectedImage] = useState(safeImages[0].url);

	return (
		<Box>
			{/* Main Image */}
			<Box
				sx={{
					bgcolor: '#F4F6F8',
					borderRadius: 3,
					overflow: 'hidden',
					mb: 2,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: 420
				}}
			>
				<Box
					component="img"
					src={selectedImage}
					alt={title}
					onError={(e: any) => (e.target.src = getFallbackImage())}
					sx={{
						maxWidth: '100%',
						maxHeight: '100%',
						objectFit: 'contain'
					}}
				/>
			</Box>

			{/* Thumbnail Strip */}
			<Box
				sx={{
					display: 'flex',
					gap: 1.5,
					overflowX: 'auto',
					py: 1,
					px: 0.5,
					scrollbarWidth: 'none',
					'&::-webkit-scrollbar': { display: 'none' }
				}}
			>
				{safeImages.map(img => (
					<Box
						key={img.id}
						onClick={() => setSelectedImage(img.url)}
						sx={{
							width: 90,
							height: 90,
							borderRadius: 2,
							overflow: 'hidden',
							cursor: 'pointer',
							border: selectedImage === img.url ? '2px solid #E53935' : '1px solid #ddd',
							opacity: selectedImage === img.url ? 1 : 0.7,
							transition: '0.2s',
							flexShrink: 0,
							'&:hover': { opacity: 1 }
						}}
					>
						<Box
							component="img"
							src={img.url}
							alt=""
							onError={(e: any) => (e.target.src = getFallbackImage())}
							sx={{
								width: '100%',
								height: '100%',
								objectFit: 'cover'
							}}
						/>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default ProductGallery;
