import { createServer, Socket } from "node:net";
import { createClient } from "@cobblestonejs/protocol";
import protocol770 from "@cobblestonejs/protocol/770";
import { CustomBuffer } from "@cobblestonejs/protocol/custom_buffer";

import { Client } from "./client.js";

export class Server {
  public server: ReturnType<typeof createServer>;

  constructor() {
    console.log("Server started");
    this.server = createServer();
    this.server.on("connection", (socket) => {
      this.onConnection(socket);
    });
  }

  public start(port: number) {
    this.server.listen(port);
  }

  private onConnection(socket: Socket) {
    console.log("New client connected");
    const client = createClient("serverbound", socket, protocol770);
    client.on("status:status_request", (packet) => {
      console.log("Received status request");
      client.send("status:status_response", {
        jsonResponse: JSON.stringify({
          version: {
            name: "1.21.5",
            protocol: 770,
          },
          players: {
            max: 100,
            online: 0,
          },
          description: {
            text: "Hello Rising!",
          },
        }),
      });
    });

    client.on("status:ping_request", (packet) => {
      // TODO: debug why the timestamp received is not a valid timestamp
      client.send("status:pong_response", {
        timestamp: packet.data.timestamp,
      });
    });
  }
}
