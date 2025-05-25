import { randomBytes } from "node:crypto";
import type { Socket } from "node:net";
import { createClient } from "@cobblestonejs/protocol";
import protocol770 from "@cobblestonejs/protocol/770";

import type { Connection } from "../packages/protocol/src/connection.js";
import type { Server } from "./server.js";

export class Client {
  private protocolClient: Connection<typeof protocol770, "serverbound">;

  private username: string | undefined;
  private uuid: string | undefined;

  private verifyToken: Buffer | undefined;

  constructor(
    private server: Server,
    private socket: Socket,
  ) {
    this.protocolClient = createClient("serverbound", socket, protocol770);
    this.protocolClient.on("status:status_request", async () => {
      console.log("Received status request");
      await this.protocolClient.send("status:status_response", {
        jsonResponse: {
          version: {
            name: "1.21.5",
            protocol: 770,
          },
          players: {
            max: 100,
            online: 0,
          },
          description: {
            text: "Hello Baptiste !",
          },
        },
      });
    });

    this.protocolClient.on("status:ping_request", async (packet) => {
      // TODO: debug why the timestamp received is not a valid timestamp
      await this.protocolClient.send("status:pong_response", {
        timestamp: packet.data.timestamp,
      });
    });

    this.protocolClient.on("login:hello", async (packet) => {
      console.log(
        `this.protocolClient ${packet.data.username} connected with UUID ${packet.data.uuid}`,
      );
      this.username = packet.data.username;
      this.uuid = packet.data.uuid;
      const verifyToken = randomBytes(4);
      this.verifyToken = verifyToken;
      await this.protocolClient.send("login:hello", {
        serverId: "",
        sharedSecret: this.server.keys.public,
        verifyToken,
        shouldAuthenticate: false,
      });
    });

    this.protocolClient.on("login:key", async (packet) => {
      console.log("Received login:key", packet);
      try {
        const decryptedSharedSecret = this.server.nodeRsa.decrypt(
          packet.data.sharedSecret,
        );
        const decryptedVerifyToken = this.server.nodeRsa.decrypt(
          packet.data.verifyToken,
        );
        const expectedToken = this.verifyToken;
        if (!expectedToken || !decryptedVerifyToken.equals(expectedToken)) {
          await this.protocolClient.send("login:login_disconnect", {
            reason: JSON.stringify({
              text: "Invalid verify token",
            }),
          });

          this.disconnect();
          return;
        }
        // Proceed with login using decryptedSharedSecret
        console.log("Shared secret decrypted and verify token validated.");
        this.protocolClient.setSharedSecret(decryptedSharedSecret);
        await this.protocolClient.send("login:login_finished", {
          uuid: this.uuid!,
          username: this.username!,
          properties: [],
        });
      } catch (err) {
        await this.protocolClient.send("login:login_disconnect", {
          reason: JSON.stringify({
            text: "Failed to decrypt shared secret or verify token",
          }),
        });
        this.disconnect();
      }
    });
  }

  public send(data: Buffer) {
    this.socket.write(data);
  }

  public disconnect() {
    this.socket.destroy();
    console.log("Client disconnected");
  }
}
