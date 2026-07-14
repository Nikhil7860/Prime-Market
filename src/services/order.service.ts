import { getRequest, postRequest, putRequest, deleteRequest } from "./apiMethods";

export const getAllOrders = async () => {
    return await getRequest("/orders/allOrders");
};

export const getOrdersById = async (id: string) => {
    return await getRequest(`/orders/getOrder/${id}`);
};

export const updateOrderStatus = async (body: any) => {
    return await postRequest(`/orders/updateOrderStatus`, body);
};