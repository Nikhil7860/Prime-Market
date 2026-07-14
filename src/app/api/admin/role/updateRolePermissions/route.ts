import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Role from "@/models/role";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function PUT(request: NextRequest) {
    try {
        await initializeConnections();

        const body = await request.json();

        const { roleId, permissions } = body;

        if (!roleId) {
            return NextResponse.json({ success: false, message: "Role Id is required.", }, { status: 400 });
        }

        if (!Array.isArray(permissions)) {
            return NextResponse.json({ success: false, message: "Permissions must be an array.", }, { status: 400 });
        }

        const formattedPermissions = permissions.map((item: any) => ({
            module: new mongoose.Types.ObjectId(item.moduleId),
            moduleName: item.moduleName,
            canView: item.permissions.visible,
            canCreate: item.permissions.write,
            canEdit: item.permissions.update,
            canDelete: item.permissions.delete,
        }));

        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            { $set: { permissions: formattedPermissions, }, },
            { returnDocument: "after", runValidators: true, }
        );

        if (!updatedRole) {
            return NextResponse.json({ success: false, message: "Role not found.", }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Permissions updated successfully.", data: updatedRole, }, { status: 200 });
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({ success: false, message: error.message, }, { status: 500 });
    }
}