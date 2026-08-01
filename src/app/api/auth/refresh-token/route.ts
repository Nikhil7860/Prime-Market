import { NextResponse } from "next/server";
import { refreshUserToken } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.refreshToken === null) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const result = await refreshUserToken(body.refreshToken);

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}