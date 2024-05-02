import { Server } from "@airswap/libraries";

export const isServer = (value: any): value is Server => {
  return value instanceof Server;
};
