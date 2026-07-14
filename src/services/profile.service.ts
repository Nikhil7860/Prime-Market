import { getRequest, putRequest } from "./apiMethods";

export const getProfile = async () => {
    return await getRequest("/auth/profile");
};

export const updateProfile = async (body: any) => {
    return await putRequest("/auth/profile", body);
};

export const changePassword = async (body: any) => {
    return await putRequest("/auth/changePassword", body);
};