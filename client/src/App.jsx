import { useState } from "react";
import Room from "./components/Room";
import ChatBubble from "./components/ChatBubble";
import MessageInput from "./components/MessageInput";

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [myUserName, setMyUserName] = useState("");
    const [myUserId, setMyUserId] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const handleJoin = (userName) => {
        console.log("Username:", userName);
        setMyUserName(userName);
        const newSocket = new WebSocket("ws://localhost:3000");
        newSocket.onopen = () => {
            console.log("Connected to chat");
            newSocket.send(
                JSON.stringify({
                    type: "join",
                    payload: {
                        userName,
                    },
                    // userName,
                })
            );
            setIsConnected(true);
            setSocket(newSocket);
            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const { type, user } = data;
                console.log("Received data:", data);
                if (type === "join") {
                    setMyUserId(user.id);
                }
                if (type === "message") {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            userId: data.payload.userId,
                            userName: data.payload.userName,
                            text: data.payload.text,
                        },
                    ]);
                    console.log(messages);
                }
            };
            console.log("user joining chat...");
        };
    };

    const handleLeave = () => {
        console.log("Leaving chat...");
        setIsConnected(false);
        if (socket) {
            socket.close();
            setSocket(null);
        }
    };

    const handleSend = (message) => {
        console.log("Sending message:", message);
        if (socket) {
            socket.send(
                JSON.stringify({
                    type: "message",
                    payload: {
                        userId: myUserId,
                        userName: myUserName,
                        text: message,
                    },
                })
            );
        }
    };

    return (
        <>
            {isConnected ? (
                <div className="w-screen">
                    <div className="flex justify-between items-center py-4 px-6 bg-slate-950">
                        <h1 className="font-semibold text-2xl">
                            {myUserName} @{myUserId}
                        </h1>
                        <button
                            className="btn btn-accent"
                            onClick={handleLeave}
                        >
                            Leave Chat Room
                        </button>
                    </div>
                    {/* code for chat ui will go here */}
                    <div className="w-full py-4 px-6">
                        {
                            // map through messages and display them
                            messages.map((message, index) => (
                                <ChatBubble
                                    key={index}
                                    isMe={message.userId === myUserId}
                                    user={message.userName}
                                    text={message.text}
                                    showUser={
                                        index > 0
                                            ? messages[index - 1].userId !==
                                              message.userId
                                            : true
                                    }
                                />
                            ))
                        }
                    </div>
                    {/*  input box to send message + send button*/}
                    <MessageInput onSend={handleSend} />
                </div>
            ) : (
                <div className="w-full h-screen flex justify-center items-center">
                    <Room onJoin={handleJoin} />
                </div>
            )}
        </>
    );
}

export default App;
