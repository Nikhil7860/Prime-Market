import { NextRequest, NextResponse } from "next/server";
import Wallet from "@/models/Wallet";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })


        await initializeConnections();

        const { id } = await params;

        let wallet = await Wallet.findOne({ userId: id });

        if (wallet == null) {
            await Wallet.create({ userId: id, balance: 0 });
        }

        return NextResponse.json(wallet, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}