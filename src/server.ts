import { constants, generateKeyPairSync, randomBytes } from "node:crypto";
import { createServer, Socket } from "node:net";
import NodeRSA from "node-rsa";

import { Client } from "./client.js";

export class Server {
  public server: ReturnType<typeof createServer>;

  // TODO: make these private and provide safe access methods
  public keys: { private: string; public: Buffer };
  public nodeRsa: NodeRSA;

  constructor() {
    console.log("Server started");
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 1024,
      publicKeyEncoding: { type: "spki", format: "der" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });
    this.keys = {
      public: publicKey,
      private: privateKey,
    };
    // NOTE: only because minecraft needs RSA_PKCS1_PADDING and node:crypto doesn't support this anymore
    this.nodeRsa = new NodeRSA(this.keys.private, "pkcs1-private-pem", {
      encryptionScheme: {
        scheme: "pkcs1",
        padding: constants.RSA_PKCS1_PADDING,
      },
      environment: "browser",
    });

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
    const client = new Client(this, socket);
  }
}
