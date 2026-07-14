import { getRequest } from "./apiMethods";

export const getTransactions = async () => {
    return await getRequest("/transaction");
};

export const getTransactionById = async (id: string) => {
    return await getRequest(`/transcation/${id}`);
};