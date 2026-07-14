import { NextRequest, NextResponse } from "next/server";
import Role from "@/models/role";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
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