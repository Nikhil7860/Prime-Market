import connectDB from "@/lib/mongodb";
import { connectRabbitMQ } from "@/lib/rabiitmq/rabbitmq";
import { connectRedis } from "@/lib/redis";

export async function initializeConnections() {
    await Promise.all([
        connectDB(),
        connectRedis(),
        connectRabbitMQ()
        
    ]);
}