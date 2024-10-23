export class ChatApp {
    constructor() {
        this.messages = [];
        this.users = [];
        this.userMap = new Map();
    }
    addMessage(message) {
        if (!message.userId || !message.text) {
            console.error("Message must have a userId and text");
        }
        this.messages.push(message);
    }

    joinUser(userName) {
        const userId = "user_" + Date.now();
        const newUser = { id: userId, name: userName };
        this.users.push(newUser);
        this.userMap.set(userId, userName);
        // this.users.set(userId, userName);
        return newUser;
    }

    loadMessages() {
        return this.messages;
    }

    getUsers() {
        return this.users;
    }

    getUserName(userId) {
        return this.userMap.get(userId);
    }

    removeUser(userId) {
        this.users = this.users.filter((user) => user.id !== userId);
    }
}

// WS Messages
