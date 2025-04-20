const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User and Message models
const User = mongoose.model('User ', new mongoose.Schema({ username: String, password: String }));
const Message = mongoose.model('Message', new mongoose.Schema({ sender: String, content: String }));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
        const newMessage = new Message(message);
        newMessage.save().then(() => {
            io.emit('receiveMessage', message);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start server
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
