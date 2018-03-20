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
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: 'Andrew Kalarepa',
//     text: 'Hello World'
// }, function(dataFromServer){
//     console.log('got it', dataFromServer);
// });

// console.log($('#message-form')[0]);
jQuery('#message-form').on('submit', function(e) {
   e.preventDefault();
   socket.emit('createMessage', {
       from: 'User',
       text: jQuery('[name=message]').val()
   }, function() {

   })
});