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

    const refreshToken = jwt.sign({ ...payload, tokenId, type: "refresh", }, JWT_REFRESH_SECRET, { expiresIn: "10m", });

    return { accessToken, refreshToken, tokenId };
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};

export const decodeToken = (token: string): JwtPayload | null => {
    return jwt.decode(token) as JwtPayload | null;
};