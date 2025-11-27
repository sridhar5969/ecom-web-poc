import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../../types/cart.types';
import { RootState } from '../store';

const initialState: CartState = {
	items: [],
	totalQuantity: 0,
	totalAmount: 0
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<CartItem>) => {
			const newItem = action.payload;
			const existingItem = state.items.find(item => item.variantId === newItem.variantId);

			if (existingItem) {
				// If item exists, just increment quantity (respecting max stock if needed)
				existingItem.quantity += newItem.quantity;
			} else {
				state.items.push(newItem);
			}

			// Recalculate totals
			state.totalQuantity += newItem.quantity;
			state.totalAmount += newItem.price * newItem.quantity;
		},

		removeFromCart: (state, action: PayloadAction<string>) => {
			const variantId = action.payload;
			const existingItem = state.items.find(item => item.variantId === variantId);

			if (existingItem) {
				state.totalQuantity -= existingItem.quantity;
				state.totalAmount -= existingItem.price * existingItem.quantity;
				state.items = state.items.filter(item => item.variantId !== variantId);
			}
		},

		updateQuantity: (state, action: PayloadAction<{ variantId: string; quantity: number }>) => {
			const { variantId, quantity } = action.payload;
			const item = state.items.find(i => i.variantId === variantId);

			if (item && quantity > 0) {
				// Calculate the difference to update totals correctly
				const qtyDifference = quantity - item.quantity;

				item.quantity = quantity;
				state.totalQuantity += qtyDifference;
				state.totalAmount += item.price * qtyDifference;
			}
		},

		clearCart: state => {
			state.items = [];
			state.totalQuantity = 0;
			state.totalAmount = 0;
		}
	}
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalQty = (state: RootState) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state: RootState) => state.cart.totalAmount;

export default cartSlice.reducer;
