import API from "./api";
import { AxiosResponse } from "axios";

export const getRequest = async <T>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await API.get(url);

    return response.data;
};

export const postRequest = async <T, D = unknown>(url: string, data?: D): Promise<T> => {
    const response: AxiosResponse<T> = await API.post(url, data);

    return response.data;
};

export const putRequest = async <T, D = unknown>(url: string, data?: D): Promise<T> => {
    const response: AxiosResponse<T> = await API.put(url, data);

    return response.data;
};

export const patchRequest = async <T, D = unknown>(url: string, data?: D): Promise<T> => {
    const response: AxiosResponse<T> = await API.patch(url, data);

    return response.data;
};

export const deleteRequest = async <T>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await API.delete(url);

    return response.data;
};