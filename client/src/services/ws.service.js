import io from "socket.io-client";
import TestsStore from "../stores/Tests.store";
import FlashStore from "../stores/Flash.store";

class WebSocket {
  constructor() {
    this.connection = io("http://localhost:3001");
  }

  init() {
    const ws = this.connection;
    ws.on("testPassed", newTest => {
      TestsStore.allTests.push(newTest);
      FlashStore.createFlash("success", `Тест ${newTest.id} завершен!`);
    });
    return ws;
  }
}

export default new WebSocket();
