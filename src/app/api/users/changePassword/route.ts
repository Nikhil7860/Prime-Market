import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { initializeConnections } from "@/components/common/initializeConnections";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { VerifyToken } from "@/services/auth.service";

export async function PUT(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        await initializeConnections();

        const body = await request.json();

        const currentPasswordhash = await bcrypt.hash(body.currentPassword, 10);


        const user = await User.findOne({
            _id: body.id,
            password: currentPasswordhash,
        });


        console.log(user, "in the user")

        const hashed = await bcrypt.hash(body.newPassword, 10);

        const updateUser = await User.findByIdAndUpdate(
            body.id,
            {
                password: hashed
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updateUser) return NextResponse.json({ message: "Users not found" }, { status: 404 })

        return NextResponse.json(updateUser);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message, }, { status: 500, })
    }
}
