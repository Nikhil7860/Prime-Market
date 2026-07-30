import { NextRequest, NextResponse } from "next/server";
import Role from "@/models/role";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";
import { decodeToken } from "@/lib/jwt";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })
        let userRole = decodeToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (userRole?.role !== "user") return NextResponse.json({ message: "Not Admin", }, { status: 403 });

        await initializeConnections();

        const { id } = await params;

        const role = await Role.findById(id);

        if (!role) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        }

        role.status = role.status === "Active" ? "Inactive" : "Active";

        await role.save();

        return NextResponse.json(role, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}