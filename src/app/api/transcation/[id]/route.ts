import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/Transaction";
import { initializeConnections } from "@/components/common/initializeConnections";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await initializeConnections();

        const { id } = await params;

        const Transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(id), }).sort({ createdAt: -1 });

        return NextResponse.json(Transactions, { status: 200 });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}