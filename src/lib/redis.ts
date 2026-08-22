import { createClient } from "redis";

export const redisClient = createClient({ url: process.env.REDIS_URL as string })

redisClient.on("error", (err: Error) => { console.error("Redis Error:", err); });

export const connectRedis = async (): Promise<void> => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("✅ Connected:", "Redis connected Sucessfully");
    }
};