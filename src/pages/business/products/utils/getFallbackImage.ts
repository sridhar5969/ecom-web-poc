import { ProductDetail, ProductListItem } from '../../../../types/product.types';

export const getFallbackImage = (product?: ProductDetail | ProductListItem): string => {
	if (product?.primary_image_url) {
		return product.primary_image_url;
	}

	if (product && 'images' in product && product.images?.length && product.images[0]?.url) {
		return product.images[0].url;
	}

	return 'https://dummyimage.com/600x600/eeeeee/aaaaaa&text=No+Image';
};
