import { apiUrls, mainnets, testnets } from "@airswap/constants";
const rpcUrls: Record<number, string> = mainnets.concat(testnets).map((chainId) => process.env[`REACT_APP_RPC_URL_${chainId}`] || apiUrls[chainId]);
export default rpcUrls