import fly from '../common/flyioRequest'
let socketOpen = false;
let socketMsgQueue = [];
let WebSocketUrl = fly.config.baseURL.replace('https://', '')
export default {
    client: null,
    baseURL: 'ws://' + WebSocketUrl + ':15674/ws',
    header:{
        login: 'app',
        passcode: '123456'
    },
    init() {
        if (this.client) {
            return Promise.resolve(this.client);
        }
        return new Promise((resolve, reject) => {
            const ws = {
                send: this.sendMessage,
                onopen: null,
                onmessage: null,
                close: this.closeSocket,
            };

            uni.connectSocket({
                url: this.baseURL,
                header: this.header,
            });

            uni.onSocketOpen(function(res) {
                console.log('WebSocket连接已打开！');
                socketOpen = true;
                for (let i = 0; i < socketMsgQueue.length; i++) {
                    ws.send(socketMsgQueue[i]);
                }
                socketMsgQueue = [];
				
                ws.onopen && ws.onopen();
            });

            uni.onSocketMessage(function(res) {
                ws.onmessage && ws.onmessage(res);
            });

            uni.onSocketError((res) => {
                console.log('WebSocket 错误！正在重连...', res);
				this.client = null;
				socketOpen = false;
				this.init()
            });

            uni.onSocketClose((res) => {
                this.client.disconnect();
                this.client = null;
                socketOpen = false;
                console.log('WebSocket 已关闭！正在重连...', res);
				this.init()
            });

            const Stomp = require('./stomp.js').Stomp;
            Stomp.setInterval = function(interval, f) {
                return setInterval(f, interval);
            };
            Stomp.clearInterval = function(id) {
                return clearInterval(id);
            };

            let client = this.client = Stomp.over(ws);
            client.connect(this.header, (res) => {
                console.log('stomp connected', res);
                resolve(client);
            }, (err) => {
				this.init()
			});
        });
    },
    disconnect() {
        uni.closeSocket();
    },
    sendMessage(message) {
        if (socketOpen) {
            uni.sendSocketMessage({
                data: message,
            });
        } else {
            socketMsgQueue.push(message);
        }
    },
    closeSocket() {
        console.log('closeSocket');
		
		this.client = null;
		socketOpen = false;
    },
};