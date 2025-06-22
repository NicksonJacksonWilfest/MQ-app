const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

let channel, connection;

const connectRabbitMQ = async () => {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('jobs', { durable: true });
};

app.post('/send', async (req, res) => {
    const { task, imageId } = req.body;

    const msg = { task, imageId };
    channel.sendToQueue('jobs', Buffer.from(JSON.stringify(msg)), {
        persistent: true,
    });

    console.log('📤 Message sent:', msg);
    res.send({ status: 'Sent', message: msg });
});

connectRabbitMQ().then(() => {
    app.listen(PORT, () => console.log(`🚀 Backend listening at http://localhost:${PORT}`));
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    if (channel) {
        await channel.close();
    }
    if (connection) {
        await connection.close();
    }
    console.log('🐇 RabbitMQ connection closed');
    process.exit(0);
});