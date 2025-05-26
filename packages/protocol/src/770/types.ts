type JSONTextComponent = string;
type UUID = string;
type Identifier = string;
type ByteArray = Buffer;
type NBT = any;
type Position = { x: number; y: number; z: number };

export type ClientPacketMap = {
  "status:status_response": {
    id: 0;
    name: "status:status_response";
    data: {
      jsonResponse: {
        version: { name: string; protocol: number };
        players: { max: number; online: number };
        description: { text: string };
      };
    };
  };
  "status:pong_response": {
    id: 1;
    name: "status:pong_response";
    data: { timestamp: bigint };
  };
  "login:login_disconnect": {
    id: 0;
    name: "login:login_disconnect";
    data: { reason: JSONTextComponent };
  };
  "login:hello": {
    id: 1;
    name: "login:hello";
    data: {
      serverId: string;
      sharedSecret: Buffer;
      verifyToken: Buffer;
      shouldAuthenticate: boolean;
    };
  };
  "login:login_finished": {
    id: 2;
    name: "login:login_finished";
    data: {
      uuid: UUID;
      username: string;
      properties: { name: string; value: string; signature: string }[];
    };
  };
  "login:login_compression": {
    id: 3;
    name: "login:login_compression";
    data: { threshold: number };
  };
  "login:custom_query": {
    id: 4;
    name: "login:custom_query";
    data: { messageId: number; channel: Identifier; data: ByteArray };
  };
  "login:cookie_request": {
    id: 5;
    name: "login:cookie_request";
    data: { key: Identifier };
  };
  "configuration:finish_configuration": {
    id: 3;
    name: "configuration:finish_configuration";
    data: {};
  };
  "configuration:registry_data": {
    id: 7;
    name: "configuration:registry_data";
    data: {
      registryId: Identifier;
      entries: { id: Identifier; data: NBT | undefined }[];
    };
  };
  "play:login": {
    id: 43;
    name: "play:login";
    data: {
      entityId: number;
      isHardcore: boolean;
      dimensionNames: Identifier[];
      maxPlayers: number;
      viewDistance: number;
      simulationDistance: number;
      reducedDebugInfo: boolean;
      enableRespawnScreen: boolean;
      doLimitedCrafting: boolean;
      dimensionType: number;
      dimensionName: Identifier;
      hashedSeed: bigint;
      gameMode: number;
      previousGameMode: number;
      isDebug: boolean;
      isFlat: boolean;
      hasDeathLocation: boolean;
      deathDimensionName: Identifier | undefined;
      deathLocation: Position | undefined;
      portalCooldown: number;
      seaLevel: number;
      enforcesSecureChat: boolean;
    };
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
  "login:hello": {
    id: 0;
    name: "login:hello";
    data: { username: string; uuid: UUID };
  };
  "login:key": {
    id: 1;
    name: "login:key";
    data: { sharedSecret: Buffer; verifyToken: Buffer };
  };
  "login:custom_query_answer": {
    id: 2;
    name: "login:custom_query_answer";
    data: { messageId: number; data: ByteArray | undefined };
  };
  "login:login_acknowledged": {
    id: 3;
    name: "login:login_acknowledged";
    data: {};
  };
  "login:cookie_response": {
    id: 4;
    name: "login:cookie_response";
    data: { key: Identifier; value: number[] | undefined };
  };
  "configuration:client_information": {
    id: 0;
    name: "configuration:client_information";
    data: {
      locale: string;
      viewDistance: number;
      chatMode: number;
      chatColors: boolean;
      displayedSkinParts: number;
      mainHand: number;
      enableTextFiltering: boolean;
      allowServerListing: boolean;
      particleStatus: number;
    };
  };
  "configuration:custom_payload": {
    id: 2;
    name: "configuration:custom_payload";
    data: { channel: Identifier; data: ByteArray };
  };
  "configuration:finish_configuration": {
    id: 3;
    name: "configuration:finish_configuration";
    data: {};
  };
};
export type ServerPackets = ServerPacketMap[keyof ServerPacketMap];

export type AllPackets = ClientPackets | ServerPackets;
