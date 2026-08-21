import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

const httpServer = createServer();
const PORT = Number(process.env.SOCKET_PORT) || 4500;

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

io.on("connection", (socket) => {

    console.log("Client Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client Disconnected:", socket.id);
    });

});

httpServer.listen(PORT, () => {
    console.log(`Socket Server Running on ${PORT}`);
});