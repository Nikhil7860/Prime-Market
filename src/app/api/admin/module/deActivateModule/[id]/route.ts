import { NextRequest, NextResponse } from "next/server";
import Module from "@/models/module";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await initializeConnections();

        const { id } = await params;

        const module = await Module.findById(id);

        if (!module) {
            return NextResponse.json({ message: "Module not found" }, { status: 404 });
        }

        module.status = module.status === "Active" ? "Inactive" : "Active";

        await module.save();

        return NextResponse.json(module, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}