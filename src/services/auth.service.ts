import Module from "@/models/module";
import { initializeConnections } from "@/components/common/initializeConnections";
import { generateToken, JwtPayload, verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { redisClient } from "@/lib/redis";
import User from "@/models/User";
import Role from "@/models/role";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

console.log("Imported Module:", Module?.modelName);

export async function registerUser(data: any) {
    try {
        await initializeConnections();
        const existingUser = await User.findOne({ $or: [{ email: data.email }, { phone: data.phone },], });
        if (existingUser) {
            return {
                success: false,
                status: 409,
                message: existingUser.email === data.email ? "Email already exists." : "Phone number already exists.",
            };
        }
        const roleResp: any = await Role.findOne({ "roleName": "User" })
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await User.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashed,
            role: roleResp.roleName,
            roleId: roleResp._id
        });
        return { success: true, status: 201, data: user };
    } catch (error) {
        console.log(error, "in the error of Register User Api")
        return { success: false, status: 500, error: error };
    }
};

export async function loginUser(data: any) {
    try {
        await initializeConnections()
        const user = await User.findOne({ email: data.email });
        if (!user) throw new Error("User not found");
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error("Invalid password");
        const token = generateToken({ id: user._id.toString(), role: user.role, name: user.name });
        await redisClient.set(`refresh:${user._id}`, token.refreshToken, { EX: 7 * 24 * 60 * 60 });
        const populatedUser = await User.findById(user._id).populate({ path: "roleId", populate: { path: "permissions.module" } });
        let finalResponse = {
            user,
            permissions: populatedUser?.roleId?.permissions ?? [],
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            tokenId: token.tokenId
        }
        return finalResponse;
    } catch (error) {
        console.log(error, "In the error Login Api")
        return { success: false, status: 500, error: error };
    }
}

export async function logoutUser(req: any) {
    console.log(req, "IN the Req")
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return { message: "No token provided" }

        const accessToken = authHeader.split(" ")[1] as string;

        const decoded = jwt.decode(accessToken as string) as JwtPayload;

        if (!decoded?.exp || !decoded?.id) throw new Error("Invalid token");

        const now = Math.floor(Date.now() / 1000); // Get Current Time

        const ttl = decoded.exp - now;  // Calculate the remaning time

        // check if remaning time is greater than 0
        if (ttl > 0) await redisClient.set(`blacklist:${accessToken}`, "true", { EX: ttl }); //set the token in redis with blacklist tag

        // Now delete the refresh token from redis what we have saved while login user Api 
        await redisClient.del(`refresh:${decoded.id}`);

        return { message: "User Sucessfully Logged Out" };

    } catch (error) {
        console.log(error, "in the error of Logout User Api")
        return { success: false, status: 500, error: error };
    }
};

export async function refreshUserToken(refreshToken: string) {
    try {
        if (!refreshToken) throw new Error("No refresh token");

        // ✅ verify token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;

        console.log(decoded, "In the decoded")

        // ✅ check in Redis
        const stored = await redisClient.get(`refresh:${decoded.id}`);

        console.log(stored, "In the stored")

        if (!stored || stored !== refreshToken) throw new Error("Invalid refresh token");

        // ❌ REMOVE old token (rotation step)
        await redisClient.del(`refresh:${decoded.id}`);

        // ✅ generate new tokens
        const getToken = generateToken({ id: decoded.id, role: decoded.role, name: decoded.name })

        // ✅ store new refresh token with expiry (7 days)
        await redisClient.set(`refresh:${decoded.id}`, getToken.refreshToken, { EX: 7 * 24 * 60 * 60 });// 7 days in seconds

        return { accessToken: getToken.accessToken, refreshToken: getToken.refreshToken };
    } catch (error) {
        console.log(error, "in the error of Refresh Token Api")
        return { success: false, status: 500, error: error };
    }
};

export async function VerifyToken(token: string) {
    try {
        let verifyResponse: any = verifyAccessToken(token)
        if (verifyResponse.success === false && verifyResponse.code === "TOKEN_EXPIRED" && verifyResponse.statusCode === 401) return ({ success: false, code: "TOKEN_EXPIRED", message: "Access token expired", statusCode: 401 })
        if (verifyResponse.success === false && verifyResponse.code === "INVALID_TOKEN" && verifyResponse.statusCode === 401) return ({ success: false, code: "INVALID_TOKEN", message: "Invalid access token", statusCode: 401 })
        return verifyResponse
    } catch (error) {
        console.log(error, "In the error")
        return error
    }
}