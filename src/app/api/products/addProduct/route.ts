import { NextRequest, NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import Product from "@/models/Product";
import Category from "@/models/category";
import slugify from "slugify";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const product = await createProductService(body);

        return NextResponse.json(product, { status: 201 });

    } catch (error: any) {

        console.log(error);

        return NextResponse.json({ success: false, message: error.message, }, { status: 500 });
    }
}



const createProductService = async (data: any) => {

    await initializeConnections();

    const category = await Category.findById(data.category);

    if (!category) {
        throw new Error("Category not found");
    }

    const slug = slugify(data.name, { lower: true, strict: true });

    const exists = await Product.findOne({ slug });

    if (exists) {
        throw new Error("Product already exists");
    }

    const product = await Product.create({

        name: data.name,

        slug,

        description: data.description,

        category: category._id,

        categoryName: category.categoryName,

        brand: data.brand,

        images: data.images,

        price: Number(data.price),

        discountPercentage: Number(data.discountPercentage) || 0,

        stock: Number(data.stock),

        rating: 0,

        reviews: 0,

        highlights: data.highlights,

        specifications: data.specifications,

        isFeatured: data.isFeatured,

        isActive: data.isActive,

        addedBy: data.userId,
    });

    return {
        success: true,
        message: "Product Created Successfully",
        product,
    };
};