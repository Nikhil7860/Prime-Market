import { getRequest, postRequest } from "./apiMethods";

export interface DepositPayload { userId: string; amount: number; }

export interface WithdrawPayload { amount: number; }

export const getWalletBalance = async (id: string) => {
    return await getRequest(`/Wallet/getWalletBalance/${id}`);
};

export const depositMoney = async (body: DepositPayload) => {
    return await postRequest("/Wallet/depositMoney", body);
};

export const withdrawMoney = async (body: DepositPayload) => {
    return await postRequest("/Wallet/withdrawMoney", body);
};

export const getWalletTransactions = async () => {
    return await getRequest("/wallet/transactions");
};
