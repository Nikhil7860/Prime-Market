import { connectRabbitMQ } from "@/lib/rabiitmq/rabbitmq";
import { io } from "@/SocketServer/socketServer";

const EXCHANGE = "ecommerce.events";

const QUEUE = "order.queue";

const ROUTING_KEY = "order.created";

async function start() {
    console.log("Starting Consumer...");

    const { channel } = await connectRabbitMQ();

    console.log("RabbitMQ Connected");

    await channel.assertExchange(EXCHANGE, "topic", { durable: true });

    await channel.assertQueue(QUEUE, { durable: true });

    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

    console.log("Waiting for messages...");

    channel.consume(QUEUE, async (msg: any) => {
        console.log("Message Received");

        if (!msg) return;

        const order = JSON.parse(msg.content.toString());

        // console.log(order);

        io.emit("new-order", order);

        console.log("Message Sent To Socket as new-order")

        channel.ack(msg);
    });
}

start();
