   $(function() {
      // Initialize Variables
      const socket = io();

      const $messages = $('#messages');
      const $turnOffLed = $('#turnOffLed');
      const $turnOnLed = $('#turnOnLed');

      // Socket.io listeners
      socket.on('new message', (msg) => {
        displayMessage(msg);
      });

      socket.on('close', () => {
        displayMessage('Lost connection to device.');
      });

      // Browser Event Listeners
      $turnOffLed.click(() => {
        sendData('off');
      });

      $turnOnLed.click(() => {
        sendData('on');
      });

      // Functions
      function sendData(data) {
        socket.send(data);
      }

      function displayMessage(msg) {
        $messages.append($('<li>').text(msg));
      }
    });
