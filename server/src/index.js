import express from "express";
import { WebSocketServer } from "ws";
import { ChatApp } from "./ChatApp.js";
import cors from "cors";
const port = 3000;

/*
 * Sending JSON: You can use JSON.stringify() to convert your JavaScript object into a JSON string before sending it over the WebSocket.
 * Receiving JSON: When you receive a message, you can parse it back into a JavaScript object using JSON.parse().
 * 
    ! Websocket Message
    {
        "type": "join",
        "payload": {
            "userName": "Alice"
        }
    } | {
        "type": "message",
        "payload": {
            "userId": "user_123",
            "text": "Hello, world!"
        }
    }
 */

const app = express();
app.use(cors());
const chatApp = new ChatApp();
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        const { type, payload } = data;
        // when a user joins the chat
        if (type === "join") {
            const user = chatApp.joinUser(payload.userName);
            console.log(payload.userName + "XXXX");
            const allUsers = chatApp.getUsers();
            ws.send(
                JSON.stringify({
                    type: "join",
                    message: `Welcome! ${payload.userName}`,
                    success: true,
                    user,
                })
            );

            console.log(`User ${payload.userName} joined the chat`);
            console.log("All Users: \n", allUsers);
            // console.log(ws.clients);
        }
        //! sending and broadcasting messages
        if (type === "message") {
            const newMessage = {
                type: "message",
                payload: {
                    text: data.payload.text,
                    userId: data.payload.userId,
                    userName: chatApp.getUserName(data.payload.userId),
                },
            };

            chatApp.addMessage({
                userId: newMessage.payload.userId,
                userName: newMessage.payload.userName,
                text: newMessage.payload.text,
            });
            console.log("All messages: \n", chatApp.loadMessages());

            console.log("Received message:", newMessage);

            // Broadcast the message to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(newMessage));
                }
            });
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        chatApp.removeUser(ws);
    });
});

app.get("/hello", (req, res) => {
    res.send("Hello World");
});
