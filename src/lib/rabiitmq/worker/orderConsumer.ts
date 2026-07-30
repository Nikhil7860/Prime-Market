import amqp from "amqplib";
import { connectRabbitMQ } from "../rabbitmq";

const EXCHANGE = "ecommerce.events";

const QUEUE = "email.queue";

const ROUTING_KEY = "order.created";

async function start() {

    const { channel } = await connectRabbitMQ();
    
    await channel.assertExchange(EXCHANGE, "topic", { durable: true, });
    
    await channel.assertQueue(QUEUE, { durable: true, });
    
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
    
    channel.consume(QUEUE, async (msg: any) => {
    
        if (!msg) return;
    
        const order = JSON.parse(msg.content.toString());
    
        console.log(order);
    
        // Send Email
    
        // channel.ack(msg);
    });
}

start();