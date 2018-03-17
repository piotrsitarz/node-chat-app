var socket = io();

socket.on('connect', function() {

    console.log('Connected to server.');

    // socket.emit('createEmail', {
    //     from: 'janna@op.gg',
    //     to: 'noob team'
    // })

    // socket.emit('createMessage', {
    //     from: 'Mistrzunio',
    //     text: 'Ale piekny jest ten swiat:)'
    // })

});

socket.on('disconnect', function() {
    console.log('Disonnected from server.');
});

// socket.on('newEmail', function(email) {
//     console.log('New email', email);
// });

socket.on('newMessage', function(message) {
    console.log('New message', message);
});
