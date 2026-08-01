import amqp from "amqplib";
import type { Channel, Connection } from "amqplib";

let connection: any | null = null;
let channel: any | null = null;

export async function connectRabbitMQ() {

    if (connection && channel) return { connection, channel };

    // const url = process.env.RABBITMQ_URL;

    const url = "amqp://guest:guest@localhost:5672"


    console.log(url, "In the URL")

    if (!url) throw new Error("RABBITMQ_URL is not defined");

    connection = await amqp.connect(url);

    channel = await connection.createChannel();

    return { connection, channel };
}