import { NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { VerifyToken } from "@/services/auth.service";
import mongoose from "mongoose";


export async function POST(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })


        await initializeConnections();

        const body = await request.json();

        const { id } = body

        const updateUser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

        return NextResponse.json(updateUser, { status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}