import { NextResponse } from "next/server";
import Role from "@/models/role";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";

export async function PUT(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role === "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });
        
        await initializeConnections();

        const body = await request.json();

        const updateRole = await Role.findByIdAndUpdate(
            body.id,
            {
                roleName: body.roleName,
                description: body.description,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updateRole) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        }

        return NextResponse.json(updateRole, { status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}