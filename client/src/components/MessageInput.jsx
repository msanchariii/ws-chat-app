// src/components/MessageInput.js
import { useState } from "react";
import PropTypes from "prop-types";

function MessageInput({ onSend }) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="absolute bottom-0 px-6 py-2 w-full flex justify-between items-center space-x-2 ">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="input input-success flex-1"
            />
            <button onClick={handleSend} className="btn btn-success">
                Send
            </button>
        </div>
    );
}
MessageInput.propTypes = {
    onSend: PropTypes.func.isRequired,
};

export default MessageInput;
// export default MessageInput;
