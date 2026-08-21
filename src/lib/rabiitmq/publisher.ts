import { connectRabbitMQ } from "./rabbitmq";

const EXCHANGE = "ecommerce.events";

export async function publishMessage(routingKey: string, data: any) {

    console.log(routingKey, "routingKey")
    console.log(data, "In the data")

    const { channel } = await connectRabbitMQ();

    await channel.assertExchange(EXCHANGE, "topic", { durable: true, });

    channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(data)), { persistent: true, });
}