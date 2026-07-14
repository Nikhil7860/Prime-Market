import { connectRabbitMQ } from "./rabbitmq";

export async function publishMessage(queue: string, data: unknown) {
    const { channel } = await connectRabbitMQ();

    await channel.assertQueue(queue, {
        durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true, });
}