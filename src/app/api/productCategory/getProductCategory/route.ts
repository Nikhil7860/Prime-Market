import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Category from "@/models/category";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function GET(request: Request) {
    try {

        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        await initializeConnections();

        const count = await Category.countDocuments();

        if (count === 0) {

            const userId = new mongoose.Types.ObjectId("6a5332521d2a1e9c4b5e1053");

            await Category.insertMany([
                {
                    categoryName: "Smartphones",
                    slug: "smartphones",
                    description: "Latest Android and iOS smartphones from top brands.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/smartphones.png",
                    parentCategory: null,
                    displayOrder: 1,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Laptops",
                    slug: "laptops",
                    description: "High-performance laptops for work, gaming and everyday use.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/laptops.png",
                    parentCategory: null,
                    displayOrder: 2,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Tablets",
                    slug: "tablets",
                    description: "Premium tablets for entertainment, education and productivity.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/tablets.png",
                    parentCategory: null,
                    displayOrder: 3,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Smart Watches",
                    slug: "smart-watches",
                    description: "Advanced smartwatches with health and fitness tracking.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/smartwatches.png",
                    parentCategory: null,
                    displayOrder: 4,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Audio",
                    slug: "audio",
                    description: "Wireless earbuds, headphones, speakers and audio accessories.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/audio.png",
                    parentCategory: null,
                    displayOrder: 5,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Gaming",
                    slug: "gaming",
                    description: "Gaming consoles, accessories, keyboards and gaming gear.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/gaming.png",
                    parentCategory: null,
                    displayOrder: 6,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Cameras",
                    slug: "cameras",
                    description: "DSLR, mirrorless and professional cameras.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/cameras.png",
                    parentCategory: null,
                    displayOrder: 7,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Accessories",
                    slug: "accessories",
                    description: "Cases, chargers, cables, power banks and electronic accessories.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/accessories.png",
                    parentCategory: null,
                    displayOrder: 8,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Home Appliances",
                    slug: "home-appliances",
                    description: "Essential appliances for home and kitchen.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/home-appliances.png",
                    parentCategory: null,
                    displayOrder: 9,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                },

                {
                    categoryName: "Smart Home",
                    slug: "smart-home",
                    description: "Smart lights, cameras, security systems and home automation.",
                    image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/categories/smart-home.png",
                    parentCategory: null,
                    displayOrder: 10,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                },
            ]);

        }

        const productsCatagory = await Category.find();

        return NextResponse.json(productsCatagory, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}