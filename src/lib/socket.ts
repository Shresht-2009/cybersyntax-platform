import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function getSocketIO(httpServer?: HTTPServer) {
  if (!io && httpServer) {
    io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      socket.on("join", (userId: string) => {
        socket.join(userId);
      });

      socket.on("message", (msg: { conversationId: string; senderId: string; content: string }) => {
        socket.to(msg.conversationId).emit("message", msg);
        socket.broadcast.emit("message", msg);
      });

      socket.on("disconnect", () => {});
    });
  }

  return io;
}
