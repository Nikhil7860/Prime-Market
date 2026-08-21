import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export interface JwtPayload {
    id: string;
    role?: string;
    name?: string;
    tokenId?: string;
    type?: "access" | "refresh";
    iat?: number;
    exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing");
}

export const generateToken = (payload: JwtPayload) => {
    const tokenId = uuidv4();

    const accessToken = jwt.sign({ ...payload, tokenId, type: "access", }, JWT_SECRET, { expiresIn: "1m", });

    const refreshToken = jwt.sign({ ...payload, tokenId, type: "refresh", }, JWT_REFRESH_SECRET, { expiresIn: "2m", });

    return { accessToken, refreshToken, tokenId };
};

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error: any) {

        if (error.name === "TokenExpiredError") {
            return {
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Access token has expired",
                expiredAt: error.expiredAt,
                statusCode: 401
            } as any;
        }

        if (error.name === "JsonWebTokenError") {
            return {
                success: false,
                code: "INVALID_TOKEN",
                message: "Invalid access token",
                statusCode: 401
            } as any;
        }

        return {
            success: false,
            code: "UNKNOWN_ERROR",
            message: error.message,
            statusCode: 500
        } as any;
    }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        let tokenResult = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
        console.log(tokenResult, "In the tokenResult")
        return tokenResult
    } catch (error: any) {

        console.log(error, "In the error")

        if (error.name === "TokenExpiredError") {
            return {
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Access token has expired",
                expiredAt: error.expiredAt,
                statusCode: 401
            } as any;
        }

        if (error.name === "JsonWebTokenError") {
            return {
                success: false,
                code: "INVALID_TOKEN",
                message: "Invalid access token",
                statusCode: 401
            } as any;
        }

        return {
            success: false,
            code: "UNKNOWN_ERROR",
            message: error.message,
            statusCode: 500
        } as any;
    }
};



export const decodeToken = (token: string): JwtPayload | null => {
    return jwt.decode(token) as JwtPayload | null;
};