import { NextResponse } from "next/server";
import Module from "@/models/module";
import mongoose from "mongoose";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";

export async function PUT(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role !== "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });
        
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