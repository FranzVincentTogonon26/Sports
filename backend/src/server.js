import http from 'http';
import express from 'express'
import helmet from 'helmet';
import morgan from 'morgan';

import { ENV } from './config/env.js'
import matchRouter  from './routes/matchRouter.js'
import { securityMiddleware } from "./config/arcjet.js";
import { attachWebSocketServer } from './ws/ws-server.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev')); // log the request
app.use(securityMiddleware());

// Routes
app.use('/api/matches', matchRouter);

const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen( ENV.PORT, ENV.HOST, () => {
    const baseUrl = ENV.HOST === '0.0.0.0' ? `http://localhost:${ENV.PORT}` : `http://${ENV.HOST}:${ENV.PORT}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
})