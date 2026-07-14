import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET() {
    try {
        await initializeConnections();

        const Users = await User.find();

        if (!Users) return NextResponse.json({ message: "Users not found" }, { status: 404 })

        return NextResponse.json(Users);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message, }, { status: 500, })
    }
}
