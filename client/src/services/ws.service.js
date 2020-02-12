import io from "socket.io-client";
import TestsStore from "../stores/Tests.store";
import FlashStore from "../stores/Flash.store";
import { WS_SERVER } from "../config/config";

class WebSocket {
  constructor() {
    this.connection = io(WS_SERVER);
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
