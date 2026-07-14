import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartProduct {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    stock: number;
    quantity: number;
}

export interface CartState {
    products: CartProduct[];
    orderId: string;
    categoryAry: []
}

const initialState: CartState = {
    products: [],
    orderId: "",
    categoryAry: []
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCartState: (state, action: PayloadAction<CartProduct>) => {
            const existingProduct = state.products.find(
                (item) => item._id === action.payload._id
            );

            if (existingProduct) {
                existingProduct.quantity += action.payload.quantity;
            } else {
                state.products.push(action.payload);
            }
        },

        increment: (state, action: PayloadAction<CartProduct>) => {
            const item = state.products.find(
                (product) => product._id === action.payload._id
            );

            if (item && item.quantity < item.stock) {
                item.quantity += 1;
            }
        },

        decrement: (state, action: PayloadAction<CartProduct>) => {
            const item = state.products.find(
                (product) => product._id === action.payload._id
            );

            if (!item) return;

            if (item.quantity === 1) {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload._id
                );
            } else {
                item.quantity -= 1;
            }
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(
                (product) => product._id !== action.payload
            );
        },


        emptyTheCart: (state) => {
            state.products = [];
            state.orderId = "";
        },

        addCategory: (state, action: any) => {
            state.categoryAry = action.payload
        },

    },
});

export const { addToCartState, increment, decrement, removeFromCart, emptyTheCart, addCategory } = cartSlice.actions;

export default cartSlice.reducer;