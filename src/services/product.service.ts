import { getRequest, postRequest, putRequest, deleteRequest } from "./apiMethods";

interface updateStatus {
    id: string,
    status: boolean
}

export const getProducts = async () => {
    return await getRequest("/products/getProducts");
};

export const getProductById = async (id: string) => {
    return await getRequest(`/products/getProductById/${id}`);
};

export const getProductByCategoryName = async (category: string) => {
    return await getRequest(`/products/getProductByCategoryName/${category}`);
};

export const createProduct = async (body: any) => {
    return await postRequest("/products/createProduct", body);
};

export const updateProduct = async (id: string, body: any) => {
    return await putRequest(`/products/updateProduct/${id}`, body);
};

export const deleteProductApi = async (id: string) => {
    return await deleteRequest(`/products/deleteProduct/${id}`);
};
export const updateProductStatus = async (body: updateStatus) => {
    return await postRequest(`/products/updatestatus`, body);
};

