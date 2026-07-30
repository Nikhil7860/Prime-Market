import { NextResponse } from "next/server";
import { refreshUserToken } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log(body.refreshToken, "In the body.refreshToken")

        if (body.refreshToken === null) return NextResponse.json({ message: "Invalid token" }, { status: 422 });

        const result = await refreshUserToken(body.refreshToken);

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}