import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { initializeConnections } from "@/components/common/initializeConnections";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        const user = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(body.id) }, { $set: { status: body.status } });

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}