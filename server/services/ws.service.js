const io = require("socket.io");

class WebSocket {
  constructor() {
    this.connections = [];
  }
  init(http) {
    this.ws = io(http);
    this.ws.on("connection", this.onConnection.bind(this));
  }
  onConnection(socket) {
    this.connections.push(socket);
    console.log(`Client ${socket.id} connected.`);
  }
  sendMessage(event, message, targetSocket = null) {
    if (!targetSocket) {
      this.ws.emit(event, message);
    } else {
      targetSocket.emit(event, message);
    }
  }
}

module.exports = new WebSocket();
