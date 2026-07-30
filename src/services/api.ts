import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "@/redux/store";
import { updateAccessToken } from "@/redux/auth/authSlice";

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, timeout: 10000 });

let isRefreshing = false;

let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) promise.reject(error);
        if (token) promise.resolve(token);
    });
    failedQueue = [];
};

// =======================
// Request Interceptor
// =======================

API.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.accessToken;
        if (token) { config.headers.Authorization = `Bearer ${token}`; }
        return config;
    }
);

// =======================
// Response Interceptor
// =======================

API.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; };
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => { failedQueue.push({ resolve, reject }); })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return API(originalRequest);
                }).catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        const state: any = store.getState();
        const refreshToken = state.auth.refreshToken;
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refreshToken`, { refreshToken, });
            const { accessToken, refreshToken: newRefreshToken, } = response.data;
            store.dispatch(updateAccessToken({ accessToken, refreshToken: newRefreshToken }));
            processQueue(null, accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return API(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            // store.dispatch(logout());
            if (typeof window !== "undefined") { window.location.href = "/login"; }
            return Promise.reject(refreshError);
        } finally { isRefreshing = false; }
    }
    return Promise.reject(error);
}
);

export default API;