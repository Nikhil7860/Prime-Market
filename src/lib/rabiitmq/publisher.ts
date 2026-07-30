import { connectRabbitMQ } from "./rabbitmq";

export async function publishMessage(queue: string, data: any) {
    const { channel } = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true, });
    let resp: any = channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true, });
    return resp
}