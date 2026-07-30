import { NextResponse } from "next/server";
import { registerUser, VerifyToken } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })

        const body = await request.json();
        const result = await registerUser(body);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}