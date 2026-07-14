import { NextResponse } from "next/server";
import Role from "@/models/role";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function PUT(request: Request) {
    try {
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

        return NextResponse.json(updateRole,{ status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}