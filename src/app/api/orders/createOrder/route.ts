import { NextResponse } from "next/server";
import Product from "@/models/Product";
import Orders from "@/models/Orders";
import Coupon from "@/models/coupon";
import { initializeConnections } from "@/components/common/initializeConnections";
import { publishMessage } from "@/lib/rabiitmq/publisher";
import { VerifyToken } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        await initializeConnections();
        const body = await request.json();
        const {
            products,
            userDetails,
            paymentStatus,
            transactionId,
            paymentMethod,
            gateway,
            currency,
            couponCode,
            discount = 0,
            status,
        } = body;

        let grandTotal = 0;
        const orderItems = [];

        let coupon = null;

        // =============================
        // Coupon Validation
        // =============================

        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });

            if (!coupon) throw new Error("Invalid coupon.");

            if (!coupon.isActive) throw new Error("Coupon is inactive.");

            const now = new Date();

            if (now < coupon.startDate) throw new Error("Coupon has not started yet.");

            if (now > coupon.endDate) throw new Error("Coupon has expired.");

            if (coupon.usedCount >= coupon.usageLimit) throw new Error("Coupon usage limit exceeded.");
        }

        // =============================
        // Product Validation
        // =============================

        for (const item of products) {

            const product = await Product.findById(item._id);

            if (!product) throw new Error(`${item.name} not found.`);

            if (product.stock < item.quantity) throw new Error(`${product.name} has only ${product.stock} left in stock.`);

            const itemTotal = item.price * item.quantity;

            grandTotal += itemTotal;

            orderItems.push({
                product: product._id,
                productName: product.name,
                image: product.images?.[0]?.image || "",
                quantity: item.quantity,
                price: product.price,
                total: itemTotal,
            });
        }

        // =============================
        // Coupon Order Validation
        // =============================

        if (coupon) {

            if (grandTotal < coupon.minOrderAmount) throw new Error(`Minimum order should be ₹${coupon.minOrderAmount}`);

            if (coupon.applicableProducts.length > 0) {

                const valid = products.some((p: any) => coupon.applicableProducts.some((id: any) => id.toString() === p._id));

                if (!valid) throw new Error("Coupon is not applicable on selected products.");
            }
        }

        // =============================
        // Deduct Stock
        // =============================

        for (const item of products) {

            const updated = await Product.findOneAndUpdate(
                {
                    _id: item._id,
                    stock: { $gte: item.quantity, },
                }, { $inc: { stock: -item.quantity, }, },
                { new: true, });

            if (!updated) throw new Error(`${item.name} is out of stock`);
        }

        // =============================
        // Update Coupon Usage
        // =============================

        if (coupon) await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1, } });

        // =============================
        // Create Order
        // =============================

        const order = await Orders.create({
            user: userDetails._id,
            userDetails: {
                name: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone,
                address: userDetails.address || "",
            },
            products: orderItems,
            paymentStatus,
            transactionId,
            paymentMethod,
            gateway,
            currency,
            amount: grandTotal - discount,
            couponCode: couponCode || "",
            discount,
            status,
            createdBy: userDetails._id,
        });

        // ======================================
        // TODO
        // RabbitMQ
        let rabbit: any = await publishMessage("order.created", order)

        console.log(rabbit, "In the rabbit")
        // ======================================

        // ======================================
        // TODO
        // Socket.IO
        // io.emit("new-order", order)
        // ======================================

        return NextResponse.json({ success: true, message: "Order created successfully.", data: order, }, { status: 201, });

    } catch (error: any) {

        console.error(error);

        return NextResponse.json({ success: false, message: error.message, }, { status: 400, });
    }
}