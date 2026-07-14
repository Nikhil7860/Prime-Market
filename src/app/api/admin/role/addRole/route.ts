import { NextResponse } from "next/server";
import Role from "@/models/role";
export async function POST(request: Request) {
    try {
        const body = await request.json();
        let createRole = Role.insertOne(body)
        return NextResponse.json(createRole,{ status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}