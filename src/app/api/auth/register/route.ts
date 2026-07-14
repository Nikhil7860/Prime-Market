import { NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result: any = await registerUser(body);
        return NextResponse.json(result, { status: result.status });
    } catch (err: any) {
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}