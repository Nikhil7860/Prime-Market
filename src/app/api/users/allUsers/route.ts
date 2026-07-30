import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function GET(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })


        await initializeConnections();

        const Users = await User.find();

        if (!Users) return NextResponse.json({ message: "Users not found" }, { status: 404 })

        return NextResponse.json(Users);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message, }, { status: 500, })
    }
}
