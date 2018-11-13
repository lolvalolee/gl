var chanelsList = {};
var apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd';

function createChatChanelContainer(chanel) {
    var chatContainer= document.getElementById('chat-conatiner');

    var container = document.createElement('div');
    chatContainer.append(container);
    container.className = 'chatBlock';

    var chatTitle = document.createElement('div');
    chatTitle.className = 'chatTitle';
    chatTitle.htmlText = chanel;

    var chatContent = document.createElement('div');
    chatContent.className = 'chatContent';

    var messageInput = document.createElement('textarea');
    messageInput.className = 'chatMessageInput';

    var sendMessageButton = document.createElement('button');
    sendMessageButton.innerHTML = 'Send message';
    sendMessageButton.onclick = function (event) {
        var container = event.target.parentElement;
        var textMessage = container.getElementsByClassName('chatMessageInput')[0].value;
        connection.send(JSON.stringify({
            "type": "message",
            "data" : textMessage,
            "username": "Galya",
            "channel": chanel,
            "key": apiKey
        }))
    };
    container.append(chatTitle);
    container.append(chatContent);
    container.append(messageInput);
    container.append(sendMessageButton);
}

function connectWebSocket() {
    var socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
    socket.addEventListener('message', function(event) {
        var message = JSON.parse(event.data);
        if (chanelsList[event.channel]) {
            chanelsList[event.channel].messages.push(
                {
                    'data': message.data,
                    'username': message.username
                }
            )
        }
    });

    socket.addEventListener('close', function(e) {
        console.log('connection closed');
    });

    return socket;
}

var connection = connectWebSocket();
function connectChanel(event) {
    var chanelName = document.getElementById('chanel-name').value;
    chanelsList[chanelName] = {'messages': []};
    createChatChanelContainer(chanelName);
    connection.send(JSON.stringify({
        "type": "message",
        "data" : "message text",
        "username": "Galya",
        "channel": chanelName,
        "key": apiKey
    }));
}
