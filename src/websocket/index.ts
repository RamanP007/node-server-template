import { Server } from "socket.io";
import * as http from "http";

const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

export const WebSocket = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    pingInterval: 25000,
    pingTimeout: 5000,
    cors: {
      origin: WEBSOCKET_CORS.origin,
      methods: ["GET", "POST"],
      credentials: false,
    },
  });

  //Emit event for testing
  io.on("connection", (socket) => {
    socket.emit("hello", "world");
  });
};
