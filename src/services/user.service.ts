import { deleteRequest, getRequest, postRequest, putRequest } from "./apiMethods";

export const getUsers = async () => {
    return await getRequest("/users/allUsers");
};

export const addUser = async (body: any) => {
    return await postRequest(`/users/addUser`, body);
};

export const updateUser = async (body: any) => {
    return await putRequest(`/users/updateUser`, body);
};

export const updateUserStatus = async (body: any) => {
    return await postRequest(`/users/updateStatus`, body);
};

export const deleteUser = async (id: string) => {
    return await deleteRequest(`/users/deleteUser/${id}`);
};