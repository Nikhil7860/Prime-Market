import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })


        await initializeConnections();

        const { id } = await params;

        const deleteUser = await User.findByIdAndDelete(id);

        return NextResponse.json(deleteUser, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}