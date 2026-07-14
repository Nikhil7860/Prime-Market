import { NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import Product from "@/models/Product";



export async function PUT(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        const { id, name, email, phone, role, roleId, status, password } = body


        return NextResponse.json("", { status: 200 });


    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}