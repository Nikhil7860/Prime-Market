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

        let wallet = await Wallet.findOne({ userId: userId });

        if (amount <= 0) return NextResponse.json({ message: "Invalid amount" }, { status: 400 });

        if (!(wallet.balance >= amount)) return NextResponse.json({ success: false, message: "Insufficient wallet balance" }, { status: 200 });

        wallet.balance -= amount;

        await wallet.save();

        await Transaction.create({
            userId: userId,
            type: "withdraw",
            amount,
            status: "success",
            description: "Money withdrwan from the  wallet",
        });

        return NextResponse.json(wallet, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message, }, { status: 400 });
    }
}