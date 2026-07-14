import { NextResponse } from "next/server";
import Role from "@/models/role";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET() {
    try {
        await initializeConnections();
        const Roles = await Role.find({});
        return NextResponse.json(Roles, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}