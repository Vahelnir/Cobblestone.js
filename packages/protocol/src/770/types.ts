export type ClientPacketMap = {
  "status:status_response": {
    id: 0;
    name: "status:status_response";
    data: { jsonResponse: string };
  };
  "status:pong_response": {
    id: 1;
    name: "status:pong_response";
    data: { timestamp: bigint };
  };
};
export type ClientPackets = ClientPacketMap[keyof ClientPacketMap];
export type ServerPacketMap = {
  "handshaking:handshake": {
    id: 0;
    name: "handshaking:handshake";
    data: {
      protocolVersion: number;
      serverAddress: string;
      serverPort: number;
      nextState: number;
    };
  };
  "status:status_request": { id: 0; name: "status:status_request"; data: {} };
  "status:ping_request": {
    id: 1;
    name: "status:ping_request";
    data: { timestamp: bigint };
  };
};
export type ServerPackets = ServerPacketMap[keyof ServerPacketMap];
export type AllPackets = ClientPackets | ServerPackets;
