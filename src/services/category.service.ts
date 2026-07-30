import { getRequest, postRequest, putRequest, deleteRequest } from "./apiMethods";

export const getCategories = async () => {
    return await getRequest("/productCategory/getProductCategory");
};

export const addCategory = async (categoryBody: any) => {
    return await postRequest(`/productCategory/addCategory`, categoryBody);
};

export const updateCategoryStatus = async (categoryBody: any) => {
    return await postRequest(`/productCategory/updateCategoryStatus`, categoryBody);
};

export const updateCategory = async (categoryBody: any) => {
    return await putRequest(`/productCategory/updateCategory`, categoryBody);
};

export const deleteCategoryApi = async (id: string) => {
    return await deleteRequest(`/productCategory/deleteCategory/${id}`);
};