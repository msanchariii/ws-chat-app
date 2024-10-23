import { useState, useEffect, useRef } from "react";
import Room from "./components/Room";
import ChatBubble from "./components/ChatBubble";
import MessageInput from "./components/MessageInput";
const wsUrl = import.meta.env.VITE_WS_URL;

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [myUserName, setMyUserName] = useState("");
    const [myUserId, setMyUserId] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    console.log("WS URL:", wsUrl);

    const handleJoin = (userName) => {
        console.log("Username:", userName);
        setMyUserName(userName);
        const newSocket = new WebSocket(wsUrl);
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
                // alert someone new joined the chat
                if (type === "join") {
                    setMyUserId(user.id);
                }
                // display the message
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

                if (type === "alert") {
                    // alert(data.message);
                    // Alert the message of new user
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            type: "alert",
                            greeting: data.message,
                        },
                    ]);
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {isConnected ? (
                <div className="w-full">
                    <div className="flex justify-between items-center py-4 px-6 bg-slate-950">
                        <div>
                            <h1 className="font-semibold text-2xl">
                                {myUserName}
                            </h1>
                            <h2>@{myUserId}</h2>
                        </div>
                        <button
                            className="btn btn-accent"
                            onClick={handleLeave}
                        >
                            Leave
                        </button>
                    </div>
                    {/* code for chat ui will go here */}
                    <div className="w-full py-4 px-4">
                        {
                            // map through messages and display them
                            messages.map((message, index) =>
                                message.type && message.type === "alert" ? (
                                    <p key={index} className="text-center my-2">
                                        {message.greeting}
                                    </p>
                                ) : (
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
                                )
                            )
                        }
                        <div className="h-20" ref={messagesEndRef} />
                        {/* <div className="h-20"></div> */}
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
