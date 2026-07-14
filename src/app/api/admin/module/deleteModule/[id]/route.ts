import { NextRequest, NextResponse } from "next/server";
import Module from "@/models/module";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await initializeConnections();

        const { id } = await params;

        const module = await Module.findByIdAndDelete(id);

        return NextResponse.json(module, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}