import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    isLoggedIn: boolean;
    walletBalance: number
    user: Record<string, unknown> | null;
    accessToken: string | null;
    refreshToken: string | null;
    tokenId: string | null;
    permissions: string[];
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    tokenId: null,
    permissions: [],
    walletBalance: 0
};

interface LoginPayload {
    userDetails: Record<string, unknown>;
    accessToken: string;
    refreshToken: string;
    tokenId: string;
    permissions?: string[];
}

interface UpdateAccessTokenPayload {
    accessToken: string;
    refreshToken: string;
}

interface UpdateUserPayload {
    userDetails: Record<string, unknown>;
}


const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.user = action.payload.userDetails;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.tokenId = action.payload.tokenId;
            state.permissions = action.payload.permissions ?? [];
            state.isLoggedIn = true;
        },

        updateAccessToken: (state, action: PayloadAction<UpdateAccessTokenPayload>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },

        updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
            state.user = {
                ...(state.user || {}),
                ...action.payload.userDetails,
            };
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.tokenId = null;
            state.permissions = [];
            state.isLoggedIn = false;
        },


    },
});

export const { login, logout, updateAccessToken, updateUser } = authSlice.actions;

export default authSlice.reducer;