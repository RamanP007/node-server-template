import express, { Application } from "express";
import cors from "cors";
import RequestHandler from "./api";
import "reflect-metadata";
import "es6-shim";
import listEndpoints from "express-list-endpoints";
import "./db.config";
import { globalErrorHandler } from "./middlewares/Error";
import cookieParser from "cookie-parser";
import "./redis.config";
import { createServer } from "http";
import { Server } from "socket.io";
import { WebSocket } from "./websocket";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

RequestHandler(app);
app.use(globalErrorHandler);
console.log(listEndpoints(app as express.Express));

export const httpServer = createServer(app);

export const io = WebSocket(httpServer);

httpServer.listen(process.env.PORT || 9001, () => {
  console.log(`🚀️ Server is running on port ${process.env.PORT || 9001}`);
});
