import { NextResponse } from "next/server";
import Module from "@/models/module";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";

export async function GET(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role !== "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });

        await initializeConnections();

        const modules = await Module.find({});
        return NextResponse.json(modules, { status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}