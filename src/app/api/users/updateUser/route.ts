import { NextResponse } from "next/server";
import { initializeConnections } from "@/components/common/initializeConnections";
import User from "@/models/User";
import bcrypt from "bcrypt";


export async function PUT(request: Request) {
    try {
        await initializeConnections();

        const body = await request.json();

        const { id, name, email, phone, role, roleId, status, password } = body

        const hashed = await bcrypt.hash(password, 10);

        const updateUser = await User.findByIdAndUpdate(id, { name: name, email: email, phone: phone, role: role, status: status, password: hashed, roleId: roleId }, { new: true, runValidators: true, });

        if (!updateUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updateUser, { status: 200 });
    } catch (err: any) {
        console.log(err, "In err")
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}