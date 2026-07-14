import { getRequest, postRequest, putRequest, deleteRequest } from "./apiMethods";

export const getRoles = async () => {
    return await getRequest("admin/role/getAllRoles");
};

export const createRole = async (body: any) => {
    return await postRequest("admin/role/addRole", body);
};

export const updateRole = async (body: any) => {
    return await putRequest(`admin/role/updateRole`, body);
};

export const deleteRoleApi = async (id: string) => {
    return await deleteRequest(`admin/role/deleteRole/${id}`);
};

export const deActivateRole = async (id: string) => {
    return await getRequest(`admin/role/deActivateRole/${id}`);
};

export const updateRolePermissions = async (body: any) => {
    return await putRequest(`admin/role/updateRolePermissions`, body);
};