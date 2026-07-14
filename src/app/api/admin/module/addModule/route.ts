import { NextResponse } from "next/server";
import Module from "@/models/module";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let createModule = Module.insertOne(body)
        return NextResponse.json(createModule,{ status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}