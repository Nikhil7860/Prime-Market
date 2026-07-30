import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/category";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function POST(request: NextRequest) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        await initializeConnections();

        const body = await request.json();

        const { categoryName, slug, description, image, parentCategory, displayOrder, isFeatured, status, addedBy, } = body;


        // Validation
        if (!categoryName || !slug || !addedBy) {
            return NextResponse.json({ success: false, message: "Category Name, Slug and Added By are required.", }, { status: 400 });
        }

        // Duplicate Category Name
        const categoryExists = await Category.findOne({ categoryName: categoryName.trim(), });

        if (categoryExists) {
            return NextResponse.json({ success: false, message: "Category already exists.", }, { status: 409 });
        }

        // Duplicate Slug
        const slugExists = await Category.findOne({ slug: slug, });

        if (slugExists) {
            return NextResponse.json({ success: false, message: "Slug already exists.", }, { status: 409 });
        }

        const category = await Category.create({
            categoryName: categoryName.trim(),
            slug: slug,
            description: description || "",
            image: image || "",
            parentCategory: parentCategory || null,
            displayOrder: displayOrder ?? 0,
            isFeatured: isFeatured ?? false,
            status: status ?? true,
            addedBy,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Category added successfully.",
                data: category,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}