import { useState } from "react";
// import { on } from "ws";

function Room({ onJoin }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

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
                disabled={loading}
                onClick={() => {
                    onJoin(username);
                    setLoading(true);
                }}
            >
                {loading ? "Joining..." : "Join Chat"}
            </button>
        </div>
    );
}

export default Room;
