import { getRequest, postRequest, putRequest, deleteRequest } from "./apiMethods";

export const getCoupons = async () => {
    return await getRequest("admin/coupon/getAllCoupons");
};

export const getCouponByCode = async (name: string) => {
    return await getRequest(`admin/coupon/couponDetailsbyName/${name}`);
};

export const createCoupon = async (body: any) => {
    return await postRequest("admin/coupon/addCoupon", body);
};

export const updateCoupon = async (body: any) => {
    return await putRequest(`admin/coupon/updateCoupon`, body);
};

export const deleteCoupon = async (id: string) => {
    return await deleteRequest(`coupon/deleteCoupon/${id}`);
};

export const deActivateCoupon = async (id: string) => {
    return await getRequest(`admin/coupon/deActivate/${id}`);
};