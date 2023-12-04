import { apiUrls, ChainIds } from "@airswap/constants";

const rpcUrls: Record<number, string> = {};
for (let chainId in ChainIds) {
  rpcUrls[chainId] =
    process.env[`REACT_APP_RPC_URL_${chainId}`] || apiUrls[chainId];
}
export default rpcUrls;
