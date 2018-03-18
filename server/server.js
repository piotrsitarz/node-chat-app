// nodejs.org   docs     path     join
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message.js');
const publicPath = path.join(__dirname, '../public');
let port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
// mamy dostep do http://localhost:3000/socket.io/socket.io/js socket library wszystkie metody


app.use(express.static(publicPath));
// console.log(__dirname +'/../public');
// console.log(publicPath);
io.on('connection', (socket) => {

  console.log('New user connected');

  // socket.emit('newEmail', {
  //     from: 'mistrzunio@op.pl',
  //     text: 'welcome mistrzuniu',
  //     createAt: 'piatek nie13go'
  // });

  // socket.emit emits event to a single connection
    // socket.emit('newMessage', {
    //     from: 'John Doe',
    //     text: 'See you then',
    //     createdAt: 12345
    // });

    // socket.on('createEmail', (newEmail) =>{
    //     console.log(newEmail);
    // });
    // socket.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'Welcome to the chat app',
    //     createdAt: new Date().getTime()
    // });
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // socket.broadcast.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'New user joined',
    //     createdAt: new Date().getTime()
    // });

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

    socket.on('createMessage', (message) =>{
        console.log('Create message:', message);
        // io.emit emits event to a every single connection
        // io.emit('newMessage', {
        //   from: message.from,
        //   text: message.text,
        //   createdAt: new Date().getTime()
        // })
        io.emit('newMessage', generateMessage(message.from, message.text));
        // socket.broadcast.emit('newMessage', {
        //   from: message.from,
        //   text: message.text,
        //   createdAt: new Date().getTime()
        // })
    });

  socket.on('disconnect', () =>{
    console.log('User was disconnected.');
  });

});

server.listen(port, ()=> {

   console.log(`Starting node chat app aplication:) on ${port}`);

});


// app.listen(port, ()=> {
//    console.log(`Starting node chat app aplication:) on ${port}`);
// });
