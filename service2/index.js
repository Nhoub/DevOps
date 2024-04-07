const mongoose = require("mongoose");
const amqp = require("amqplib");

mongoose.connect(process.env.MONGODB_HOST + "/service2").then(() => {
  console.log("Connected to MongoDB");
});

async function start() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_HOST);
    const queueName = process.env.RABBITMQ_RECEIVE;
    const ch = await conn.createChannel();
    await ch.assertQueue(queueName);
    ch.consume(queueName, (msg) => {
      ch.ack(msg);
      console.log(msg.content.toString());
    });
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.log("Failed to connect to RabbitMQ, retrying in 10s...");
    setTimeout(start, 10000);
  }
}
start();

console.log(`Server2 is ready!`);

// Test