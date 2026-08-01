import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

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

httpServer.listen(4500, () => {
    console.log("Socket Server Running on 4500");
});