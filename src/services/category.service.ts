import { getRequest, postRequest, putRequest, deleteRequest } from "./apiMethods";

interface updateStatus {
    id: string,
    status: boolean
}

export const getCategories = async () => {
    return await getRequest("/productCategory/getProductCategory");
};

export const addCategory = async (categoryBody: any) => {
    return await postRequest(`/products/getProductByCategoryName`, categoryBody);
};

export const updateCategoryStatus = async (categoryBody: any) => {
    return await postRequest(`/productCategory/updateCategoryStatus`, categoryBody);
};

export const updateCategory = async (categoryBody: any) => {
    return await putRequest(`/products/getProductByCategoryName`, categoryBody);
};

export const deleteCategoryApi = async (id: string) => {
    return await getRequest(`/products/getProductById/${id}`);
};










