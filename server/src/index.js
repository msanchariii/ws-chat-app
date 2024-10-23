import express from "express";
import { WebSocketServer } from "ws";
import { ChatApp } from "./ChatApp.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const port = process.env.PORT || 3000;
const origin = process.env.ORIGIN;

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
app.use(
    cors({
        origin: origin,
    })
);
const chatApp = new ChatApp();
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            const { type, payload } = data;

            //! joining the chat
            if (type === "join") {
                const user = chatApp.joinUser(payload.userName);
                ws.userId = user.id;
                console.log(payload.userName + "XXXX");
                const newUser = {
                    type: "join",
                    message: `Welcome! ${payload.userName}`,
                    success: true,
                    user,
                };

                ws.send(JSON.stringify(newUser));

                // Create a broadcast message to inform other clients about the new user
                const alertNewUser = {
                    type: "alert",
                    message: `${payload.userName} has joined the chat.`,
                };

                // Send the broadcast message to all clients except the new user
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === client.OPEN) {
                        client.send(JSON.stringify(alertNewUser));
                    }
                });
            }

            //! sending messages
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

                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        client.send(JSON.stringify(newMessage));
                    }
                });
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    });
    //! Remove the user from the chat app when the WebSocket connection is closed
    ws.on("close", () => {
        console.log("Client disconnected");
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(
                    JSON.stringify({
                        type: "alert",
                        message: `${chatApp.getUserName(
                            ws.userId
                        )} has left the chat.`,
                    })
                );
            }
        });
        chatApp.removeUser(ws.userId);
    });
});

app.get("/hello", (req, res) => {
    res.send("Hello World");
});
