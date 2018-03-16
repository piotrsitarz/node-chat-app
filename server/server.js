// nodejs.org   docs     path     join
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
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
    socket.emit('newMessage', {
        from: 'John Doe',
        text: 'See you then',
        createdAt: 12345
    });

    // socket.on('createEmail', (newEmail) =>{
    //     console.log(newEmail);
    // });

    socket.on('createMessage', (message) =>{
        console.log('Create message:', message);
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
