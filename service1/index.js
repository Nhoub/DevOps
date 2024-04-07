const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const order = require("./src/db/models/order");

const app = express();
const port = process.env.PORT;

const promBundle = require('express-prom-bundle');

const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    normalizePath: true,
    promClient: {
        collectDefaultMetrics: {},
    },
});

app.use(metricsMiddleware);

mongoose.connect(process.env.MONGODB_HOST + "/service1").then(() => {
  console.log("Connected to MongoDB");
});

const queueName = process.env.RABBITMQ_SEND;
let ch;

async function connectToRabbitMQ() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_HOST);
    ch = await conn.createChannel(queueName);
    await ch.assertQueue();
    ch.sendToQueue;
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.log("Failed to connect to RabbitMQ, retrying in 10s...");
    setTimeout(connectToRabbitMQ, 10000);
  }
}
connectToRabbitMQ();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/order", async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  if (!id && Number.isInteger(id) && id > 0) {
    res.status(400).send("ID is required");
  }
  if (!name && name.length > 0) {
    res.status(400).send("Name is required");
  }
  await ch.sendToQueue(queueName, Buffer.from(`Order ${id} received`));
  await order.create({ id, name });
  res.send("Order received successfully!");
});

app.get("/orders", async (req, res) => {
  const orders = await order.find();
  res.send(orders);
});

app.listen(port, () => {
  console.log(`Server1 listening on port ${port}`);
});

