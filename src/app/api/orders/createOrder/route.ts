import { NextResponse } from "next/server";
import Product from "@/models/Product";
import Orders from "@/models/Orders";
import mongoose from "mongoose";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function POST(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        let { products, userDetails, paymentStatus,

            transactionId,

            paymentMethod,

            gateway,

            currency,

            amount,

            couponCode,

            discount,

            status,

        } = body


        console.log({
            products, userDetails, paymentStatus,

            transactionId,

            paymentMethod,

            gateway,

            currency,

            amount,

            couponCode,

            discount,

            status,

        })

        let total = 0;

        const orderItems = [];


        // // ✅ deduct stock
        for (const item of products) {

            item.stock -= item.quantity;

            await Product.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(item._id) }, { stock: item.stock }, { new: true });

            total += item.price * item.quantity;

            orderItems.push({
                productName: item.name,
                product: item._id,
                quantity: item.quantity,
                price: item.price,
                image: item.images[0].image,
                total,
            });
        }

        const orderInsertation = await Orders.create({
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

            amount,

            couponCode: couponCode,

            discount: discount || 0,

            status,

            createdBy: userDetails._id,
        });

        return NextResponse.json(orderInsertation, { status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}