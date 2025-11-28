import { ProductDetail } from '../../../../types/product.types';
import { MOCK_PRODUCTS } from '../mocks/products';

export const getFallbackImage = (product?: ProductDetail): string => {
	if (product?.images?.length && product.images[0]?.url) {
		return product.images[0].url;
	}

	return 'https://dummyimage.com/600x600/eeeeee/aaaaaa&text=No+Image';
};
