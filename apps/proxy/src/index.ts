import { createConnection, createServer } from "node:net";
import { createClient, parse } from "@cobblestonejs/protocol";
import protocol770 from "@cobblestonejs/protocol/770";

import { CustomBuffer } from "../../../packages/buffer/src/custom-buffer.js";

const [host, port = "25565"] = process.argv[2].split(":");

console.log(`Proxying connections to ${host}:${port}`);

const server = createServer();

server.listen(25565);

server.on("connection", (gameSocket) => {
  console.log(
    `New connection from ${gameSocket.remoteAddress}:${gameSocket.remotePort}`,
  );
  const proxiedServer = createSocketClient();
  const serverClient = createClient("clientbound", proxiedServer, protocol770);
  const gameClient = createClient("serverbound", gameSocket, protocol770);
  proxiedServer.on("data", async (data) => {
    gameSocket.write(data);
    // console.log("from server to client", data);
  });
  gameSocket.on("data", async (data) => {
    proxiedServer.write(data);
    // console.log("from client to server", data);
  });

  gameSocket.on("close", () => {
    proxiedServer.end();
  });
});

function createSocketClient() {
  console.log(`Connecting to ${host}:${port}`);
  const client = createConnection({ host, port: Number(port) });
  client.on("connect", () => {
    console.log(`Connected to ${host}:${port}`);
  });
  return client;
}
