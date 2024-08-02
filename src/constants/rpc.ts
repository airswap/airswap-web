import { apiUrls, mainnets, testnets } from "@airswap/utils";

export const rpcUrls: Record<number, string> = [
  ...mainnets,
  ...testnets,
].reduce(
  (acc, chainId) => ({
    ...acc,
    [chainId]: process.env[`REACT_APP_RPC_URL_${chainId}`] || apiUrls[chainId],
  }),
  {}
);
