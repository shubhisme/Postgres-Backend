import amqp, { type Channel, type ChannelModel } from "amqplib";
import config from "../config/config.js";
import { AppError } from "../errors/AppError.js";

let connection: ChannelModel | null;
let channel: Channel | null;

export const RECIPT_EMAIL_QUEUE = "receipt_email_queue";

export async function getRabbitMQChannel(): Promise<Channel> {
  if (channel) return channel;

  const url = config.RABBITMQ_URL;

  if (!url) {
    throw new AppError(
      "RabbitMQ URL is not defined in the environment variables",
      500,
    );
  }

  connection = await amqp.connect(url);
  channel = await connection.createChannel();

  await channel.assertQueue(RECIPT_EMAIL_QUEUE, { durable: true });

  return channel;
}
