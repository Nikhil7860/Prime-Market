import { NextResponse } from "next/server";
import Module from "@/models/module";
import mongoose from "mongoose";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function PUT(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        const result = await Module.findByIdAndUpdate(
            new mongoose.Types.ObjectId(body.id),
            {
                $set: {
                    moduleName: body.moduleName,
                    route: body.route,
                    icon: body.icon,
                    status: body.status,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!result) {
            return NextResponse.json(
                { message: "Module not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        console.error(err);

        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}