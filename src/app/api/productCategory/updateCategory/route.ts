import { NextRequest, NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import Category from "@/models/category";

export async function PUT(req: NextRequest) {
    try {
        await initializeConnections();

        const body = await req.json();

        const {
            id,
            categoryName,
            slug,
            description,
            image,
            parentCategory,
            displayOrder,
            isFeatured,
            status,
            updatedBy,
        } = body;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category Id is required",
                },
                { status: 400 }
            );
        }

        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 }
            );
        }

        // Check duplicate category name
        const existingCategory = await Category.findOne({
            categoryName: categoryName.trim(),
            _id: { $ne: id },
        });

        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category name already exists",
                },
                { status: 409 }
            );
        }

        // Check duplicate slug
        const existingSlug = await Category.findOne({
            slug: slug.trim().toLowerCase(),
            _id: { $ne: id },
        });

        if (existingSlug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Slug already exists",
                },
                { status: 409 }
            );
        }

        category.categoryName = categoryName;
        category.slug = slug.toLowerCase();
        category.description = description;
        category.image = image;
        category.parentCategory = parentCategory || null;
        category.displayOrder = displayOrder;
        category.isFeatured = isFeatured;
        category.status = status;

        if (updatedBy) {
            category.updatedBy.push({
                user: updatedBy,
                updatedAt: new Date(),
            });
        }

        await category.save();

        return NextResponse.json(
            {
                success: true,
                message: "Category updated successfully.",
                data: category,
            },
            { status: 200 }
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