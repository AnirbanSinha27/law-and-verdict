import { Server as ServerIO } from "socket.io";
import { Server as HTTPServer } from "http";
import mongoose from "mongoose";

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: ServerIO | null = null;

export default function handler(req: any, res: any) {
  if (!io) {
    const httpServer: HTTPServer = res.socket.server;
    io = new ServerIO(httpServer, { path: "/api/socket", cors: { origin: "*" } });

// ✅ Make globally accessible
(global as any).io = io;


    console.log("✅ Socket.io server started");

    io.on("connection", (socket) => {
      console.log("🔥 New client connected:", socket.id);

      // ✅ THIS is the part you're asking about
      socket.on("register_device", async ({ deviceId }) => {
        console.log("📡 register_device:", deviceId, socket.id);

        // Lazy load the model (important for Next.js)
        const { default: UserDevice } = await import("@/dblib/models/UserDevice");

        await UserDevice.findOneAndUpdate(
          { deviceId },
          { socketId: socket.id },
          { new: true }
        );

        console.log("✅ Socket ID registered:", deviceId, socket.id);
      });
    });
  }

  res.end();
}

(global as any).socketServerInitiated = true;
