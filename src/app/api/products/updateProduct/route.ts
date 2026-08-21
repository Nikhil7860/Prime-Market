import { NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import Product from "@/models/Product";
import { VerifyToken } from "@/services/auth.service";
import Category from "@/models/category";
import slugify from "slugify";
import mongoose from "mongoose";

export async function PUT(request: Request) {
    try {

        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        const body = await request.json();

        const product = await updateProductService(body);

        return NextResponse.json(product, { status: 201 });


    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}


const updateProductService = async (data: any) => {

    await initializeConnections();

    const category = await Category.findById(data.category);

    if (!category) {
        throw new Error("Category not found");
    }

    const slug = slugify(data.name, { lower: true, strict: true });

    const exists = await Product.findOne({ _id: new mongoose.Types.ObjectId(data.id) });

    if (!exists) {
        throw new Error("Product Does Not  Exists");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        exists._id,
        {
            $set: {
                name: data.name,
                slug,
                description: data.description,
                category: category._id,
                categoryName: category.categoryName,
                brand: data.brand,
                images: data.images,
                price: Number(data.price),
                discountPercentage:
                    Number(data.discountPercentage) || 0,
                stock: Number(data.stock),
                highlights: data.highlights,
                specifications: data.specifications,
                isFeatured: data.isFeatured,
                isActive: data.isActive,
            },

            $push: {
                updatedBy: {
                    user: data.userId,
                    updatedAt: new Date(),
                },
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );
    return {
        success: true,
        message: "Product Created Successfully",
        updatedProduct,
    };
};