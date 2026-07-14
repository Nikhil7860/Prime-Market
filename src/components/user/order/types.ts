export interface OrderItem {
    _id: string;
    productName: string;
    product: string;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: string;

    items: OrderItem[];

    totalAmount: number;

    couponDiscount: number;

    paymentStatus: string;

    status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
}

export interface OrderStats {
    totalOrders: number;
    delivered: number;
    pending: number;
    cancelled: number;
    totalSpent: number;
}