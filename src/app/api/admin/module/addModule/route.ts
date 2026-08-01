import { NextResponse } from "next/server";
import Module from "@/models/module";
import { VerifyToken } from "@/services/auth.service";
import { initializeConnections } from "@/components/common/initializeConnections";
import { decodeToken } from "@/lib/jwt";

export async function POST(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role === "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });
        
        await initializeConnections();
        const body = await request.json();
        let createModule = Module.insertOne(body)
        return NextResponse.json(createModule, { status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}