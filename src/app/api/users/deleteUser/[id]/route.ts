import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await initializeConnections();

        const { id } = await params;

        const deleteUser = await User.findByIdAndDelete(id);

        return NextResponse.json(deleteUser, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}