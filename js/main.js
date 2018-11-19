var chanelsList = {};
var apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd';

function closeChatWindow(chanelName) {
    this.remove();
    if (chanelName) {
        delete chanelsList[chanelName];
    }
}

function createEmptyChatContainer() {
    var chatContainer= document.body;
    var container = document.createElement('div');
    chatContainer.append(container);
    container.className = 'chatBlock';

    var chatTitle = document.createElement('div');
    chatTitle.className = 'chatTitle';
    chatTitle.innerHTML = 'Enter chanel name';
    chatTitle.onmousedown = chatContainerOnMouseDown;

    var closeChatWindowButton = document.createElement('button');
    closeChatWindowButton.innerText = 'x';
    closeChatWindowButton.className = 'close-chat-window-button';
    closeChatWindowButton.onclick = closeChatWindow.bind(container, undefined);

    var chatName = document.createElement('input');
    chatName.className = 'chanel-name-input';

    var confirmChatNameButton = document.createElement('button');
    confirmChatNameButton.innerHTML = 'Connect chat';
    confirmChatNameButton.onclick = createChanelContainer;

    container.append(chatTitle);
    container.append(closeChatWindowButton);
    container.append(chatName);
    container.append(confirmChatNameButton);


}

function createChanelContainer(event) {
    var container = this.parentElement;
    var input = container.getElementsByClassName('chanel-name-input')[0];
    var chanelName = input.value;
    input.remove(); // remove chanel name input
    this.remove(); // remove connect chanel button
    container.getElementsByClassName('chatTitle')[0].innerHTML = chanelName;
    container.className = 'chatBlock';

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
            "channel": chanelName,
            "key": apiKey
        }))
    };
    container.append(chatContent);
    container.append(messageInput);
    container.append(sendMessageButton);

    chanelsList['container'] = container;

    var closeChatWindowButton = container.getElementsByClassName('close-chat-window-button');
    closeChatWindowButton.onclick = closeChatWindow.bind(container, chanelName);
}

function connectWebSocket() {
    var socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
    socket.addEventListener('message', function(event) {
        var message = JSON.parse(event.data);
        if (chanelsList[message.channel]) {
            console.log('append message');
            chanelsList[message.channel].messages.push(
                {
                    'data': message.data,
                    'username': message.username
                }
            );
            chanelsList.container.getElementsByClassName('chatContent');
            var messageContainer = document.createElement('div');
            var messageAuthor = document.createElement('span');
            var messageText = document.createElement('p');

            messageContainer.className = 'message-container';

            messageAuthor.className = 'message-author';
            messageAuthor.innerHTML = message.username;

            messageText.className = message.text;
            messageText.innerHTML = message.data;

            messageContainer.append(messageAuthor);
            messageContainer.append(messageText);
            chanelsList.container.append(messageContainer);
        }
    });

    socket.addEventListener('close', function(e) {
        console.log('connection closed');
    });

    return socket;
}

var connection = connectWebSocket();
function connectChanel() {
    var chanelName = document.getElementById('chanel-name').value;
    chanelsList[chanelName] = {'messages': []};
    createChatChanelContainer(chanelName);
}

// drag and drop

chatContainerOnDragStart = function() {
    return false;
};

function getCoords(elem) {   // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function chatContainerOnMouseDown(event) {
    var chatBlock = this.parentElement;
    var coords = getCoords(chatBlock);
    var shiftX = event.pageX - coords.left;
    var shiftY = event.pageY - coords.top;

    function moveAt(e) {
        chatBlock.style.left = e.pageX - shiftX + 'px';
        chatBlock.style.top = e.pageY - shiftY + 'px';
    }

    chatBlock.style.position = 'absolute';
    document.body.appendChild(chatBlock);
    moveAt(event);

    chatBlock.style.zIndex = 1000;
    document.onmousemove = function(e) {
        moveAt(e);
    };

    chatBlock.onmouseup = function() {
        document.onmousemove = null;
        chatBlock.onmouseup = null;
    };
}

