import { useState } from "react";
// import { on } from "ws";

function Room({ onJoin }) {
    const [username, setUsername] = useState("");

    return (
        <div className="flex items-center justify-center space-x-4">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="border-2 p-3 rounded-lg"
            />
            <button
                className="border-2 p-3 rounded-lg hover:bg-white hover:text-black font-bold"
                onClick={() => {
                    onJoin(username);
                    setUsername("");
                }}
            >
                Join Chat
            </button>
        </div>
    );
}

export default Room;

// In your main component:
// function ChatApp() {
//     const handleJoinChat = (username) => {
//         const socket = new WebSocket("ws://localhost:3000");

//         socket.onopen = () => {
//             console.log("Connected to chat");
//             // Send a join message with the username
//             socket.send(
//                 JSON.stringify({
//                     type: "join",
//                     payload: { userName: username },
//                 })
//             );
//         };

//         socket.onmessage = (event) => {
//             console.log("Message from server:", event.data);
//         };

//         socket.onerror = (error) => {
//             console.error("WebSocket error:", error);
//         };

//         socket.onclose = () => {
//             console.log("Disconnected from chat");
//         };
//     };

//     return <Room onJoin={handleJoinChat} />;
// }
