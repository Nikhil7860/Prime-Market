import { NextResponse } from "next/server";
import { loginUser } from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await loginUser(body);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}