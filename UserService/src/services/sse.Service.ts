import { Request, Response } from "express";

interface SSEClients {
  [userId: string]: Response[];
}

export const sseClients: SSEClients = {};

export function initSSE(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).end();

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  if (!sseClients[userId]) sseClients[userId] = [];
  sseClients[userId].push(res);

  req.on('close', () => {
    sseClients[userId] = sseClients[userId].filter(r => r !== res);
  });
}

export function sendSSE(userId: string, event: string, data: any) {
  const clients = sseClients[userId];
  if (!clients) return;

  clients.forEach(res => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
