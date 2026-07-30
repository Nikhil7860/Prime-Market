import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { redisClient } from "@/lib/redis";
import { initializeConnections } from "@/components/common/initializeConnections";

export async function POST(req: NextRequest) {
    try {
        await initializeConnections();

        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            );
        }

        const accessToken = authHeader.split(" ")[1];

        const decoded = jwt.decode(accessToken) as JwtPayload | null;

        if (!decoded?.exp || !decoded?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const now = Math.floor(Date.now() / 1000);

        // Remaining expiry time of access token
        const ttl = decoded.exp - now;

        // Blacklist access token until it expires
        if (ttl > 0) {
            await redisClient.set(
                `blacklist:${accessToken}`,
                "true",
                {
                    EX: ttl,
                }
            );
        }

        // Delete refresh token
        await redisClient.del(`refresh:${decoded.id}`);

        return NextResponse.json({ success: true, message: "User logged out successfully.", }, { status: 200, });
    } catch (error: any) {
        console.error("Logout Error:", error);

        return NextResponse.json({ success: false, message: error.message || "Something went wrong", }, { status: 500, });
    }
}