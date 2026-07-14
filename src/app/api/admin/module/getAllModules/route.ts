import { NextResponse } from "next/server";
import Module from "@/models/module";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function GET(request: Request) {
    try {
        await initializeConnections();

        const modules = await Module.find({});
        return NextResponse.json(modules,{ status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}