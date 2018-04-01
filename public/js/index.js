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
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from} ${formattedTime}:`);
  a.attr('href', message.url);
  li.append(a);
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

   let messageTextbox = jQuery('[name=message]');
   socket.emit('createMessage', {
       from: 'User',
       text: messageTextbox.val()
   }, function() {
      messageTextbox.val('');
   })
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
      return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled','disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
    }, function() {
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location.');
    });
});
