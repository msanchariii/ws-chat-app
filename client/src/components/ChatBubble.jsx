import PropTypes from "prop-types";

function ChatBubble({ isMe, user, text, showUser = true }) {
    let alignment;
    if (isMe === true) {
        alignment = "chat-end";
    } else {
        alignment = "chat-start";
    }
    return (
        <div className={`chat ${alignment}`}>
            {showUser && (
                <div className="chat-header opacity-65 px-1">{user}</div>
            )}

            <div
                className={`chat-bubble font-semibold ${
                    !isMe ? "bg-success/80 text-white" : ""
                }`}
            >
                {text}
            </div>
        </div>
    );
}

ChatBubble.propTypes = {
    isMe: PropTypes.bool.isRequired,
    user: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    showUser: PropTypes.bool.isRequired,
};

export default ChatBubble;
