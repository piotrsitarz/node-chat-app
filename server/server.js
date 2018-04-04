// nodejs.org   docs     path     join
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');
const publicPath = path.join(__dirname, '../public');
let port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let users = new Users();
// mamy dostep do http://localhost:3000/socket.io/socket.io/js socket library wszystkie metody


app.use(express.static(publicPath));
console.log(publicPath);
console.log(__dirname);
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
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    //
    // // socket.broadcast.emit('newMessage', {
    // //     from: 'Admin',
    // //     text: 'New user joined',
    // //     createdAt: new Date().getTime()
    // // });
    //
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
          return callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // socket.leave('fancy name room');
        // io.emit     to everybody   -> io.to('fancy name room').emit to everybody in room
        //socket.broadcast.emits  to everybody except current user -> socket.broadcast.to('fancy name room').emit to everybody in room except current user
        //socket.emit   to only current user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        callback();
    });

    socket.on('createMessage', (message, callback) =>{
        console.log('Create message:', message);
        let user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
          io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        // io.emit emits event to a every single connection
        // io.emit('newMessage', {
        //   from: message.from,
        //   text: message.text,
        //   createdAt: new Date().getTime()
        // })
        // io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
        // socket.broadcast.emit('newMessage', {
        //   from: message.from,
        //   text: message.text,
        //   createdAt: new Date().getTime()
        // })
    });

    // socket.on('createLocationMessage', (coords) => {
    //     io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
    // });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        if (user) {
          io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

  socket.on('disconnect', () =>{
    console.log('User was disconnected.');
    console.log(users);
    let user = users.removeUser(socket.id);
    console.log(users);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
    }
  });

});

server.listen(port, ()=> {

   console.log(`Starting node chat app aplication:) on ${port}`);

});


// app.listen(port, ()=> {
//    console.log(`Starting node chat app aplication:) on ${port}`);
// });
