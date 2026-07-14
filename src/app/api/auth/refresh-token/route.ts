import { NextResponse } from "next/server";
import { logoutUser } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = await logoutUser(body.refreshToken);

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}