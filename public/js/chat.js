const socket = io();

function scrollToBottom() {
  let messages = jQuery('#messages');
  let newMessage = messages.children('li:last-child');

  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
    // if (clientHeight + scrollTop < scrollHeight) {
    //   messages.scrollTop(scrollHeight);
    // }
}

socket.on('connect', function() {

    // console.log('Connected to server.');
    let params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
          alert(err);
          window.location.href = '/';
        } else {
          console.log('No error.');
        }
    });
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

socket.on('updateUserList', function(users) {
  console.log('Users list', users);
  let ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

// socket.on('newEmail', function(email) {
//     console.log('New email', email);
// });

socket.on('newMessage', function(message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
      text:message.text,
      from:message.from,
      createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

    // let li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template, {
    from:message.from,
    url:message.url,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();

  // let li = jQuery('<li></li>');
  // let a = jQuery('<a target="_blank">My current location</a>');
  //
  // li.text(`${message.from} ${formattedTime}:`);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
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
