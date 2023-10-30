import express, { Express, Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
const cfg = {
  title: 'WebSocket Chat',
  port: process.env.PORT ?? 8000,
  wsPort: parseInt(process.env.WSPORT || '3001'), // Convert to a number
  nameLen: 15,
  msgLen: 200,
};

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  const generatedUUID = uuidv4(); // Generate a new UUID
  console.log(generatedUUID);
  res.send(generatedUUID);
});

app.listen(cfg.port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${cfg.port}`);
  console.log(`⚡️[web-socket] server: ws://localhost:${cfg.wsPort}`);
});

// --------------------------
// WebSocket server
const ws = new WebSocketServer({ port: cfg.wsPort });

ws.on('connection', (socket, req: IncomingMessage) => {
  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'join') {
        const { userAcc }: { userAcc: string } = message;

        console.log(`${userAcc} joined chat room`);
      } else if (message.type === 'message') {
        // Handle regular chat messages
        const { userAcc, mess }: { userAcc: string; mess: string } = message;
        console.log(`Received message from ${userAcc}: ${mess}`);

        const messageObject = {
          userAcc,
          mess: mess,
        };

        ws.clients.forEach((client) => {
          client.readyState === WebSocket.OPEN && client.send(JSON.stringify(messageObject));
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  socket.on('close', () => {});
});
