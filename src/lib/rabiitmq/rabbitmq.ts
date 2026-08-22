import "dotenv/config";
import amqp from "amqplib";
let connection: any | null = null;
let channel: any | null = null;

export async function connectRabbitMQ() {

    if (connection && channel) return { connection, channel };

    const url = process.env.RABBITMQ_URL;

    if (!url) throw new Error("RABBITMQ_URL is not defined");

    connection = await amqp.connect(url);

    channel = await connection.createChannel();

    console.log("✅ Connected:", "RABBITMQ Sucessfully Connected");

    return { connection, channel };
}