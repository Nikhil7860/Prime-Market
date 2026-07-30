import { NextResponse } from "next/server";
import { VerifyToken } from "@/services/auth.service";
import Wallet from "@/models/Wallet"
import Transaction from "@/models/Transaction";

export async function POST(request: Request) {
    try {
        let tokenVerification: any = await VerifyToken(request.headers.get("authorization")?.split(" ")[1] as string)
        if (tokenVerification.success === false) return NextResponse.json(tokenVerification, { status: tokenVerification.statusCode })


        const body = await request.json();

        let { userId, amount } = body

        if (amount <= 0) {
            throw new Error("Invalid amount");
        }

        let wallet = await Wallet.findOne({ userId: userId });

        wallet.balance += amount;

        await wallet.save();

        await Transaction.create({
            userId: userId,
            type: "deposit",
            amount,
            status: "success",
            description: "Money added to wallet",
        });

        return NextResponse.json(wallet, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}