import { getRequest, postRequest, putRequest, deleteRequest } from "./apiMethods";

export const getModules = async () => {
    return await getRequest("admin/module/getAllModules");
};

export const createModule = async (body: any) => {
    return await postRequest("admin/module/addModule", body);
};

export const updateModule = async (body: any) => {
    return await putRequest(`admin/module/updateModule`, body);
};

export const deleteModuleApi = async (id: string) => {
    return await deleteRequest(`admin/module/deleteModule/${id}`);
};
export const deActivateModule = async (id: string) => {
    return await getRequest(`admin/module/deActivateModule/${id}`);
};