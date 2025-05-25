import type { ProtocolType } from "./protocol.js";

type ProtocolTypeFactory<T, O = void> = (options?: O) => ProtocolType<T>;

export function defineProtocolType<T, O = void>(
  factoryOrType: ((options: O) => ProtocolType<T>) | ProtocolType<T>,
): ProtocolTypeFactory<T, O> {
  if (typeof factoryOrType === "function") {
    return factoryOrType as ProtocolTypeFactory<T, O>;
  }

  return () => factoryOrType;
}
