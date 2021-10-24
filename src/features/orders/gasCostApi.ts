const apiKey = process.env.REACT_APP_DEFIPULSE_API_KEY;
const apiUrl = "https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json";

// TODO:
// - Estimate amount (i.e. number) of gas used for a swap
// - Be able to convert the cost of the transaction in ETH into any
//   token for comparisons

type GasApiResponse = {
  fast: number;
  fastest: number;
  safeLow: number;
  average: number;
  block_time: number;
  blockNum: number;
  speed: number;
  safeLowWait: number;
  avgWait: number;
  fastWait: number;
  fastestWait: number;
  gasPriceRange: Record<number, number>;
};

const getFastGasPrice: () => Promise<number | null> = async () => {
  const urlWithKey = `${apiUrl}?api-key=${apiKey}`;
  try {
    const response = await fetch(urlWithKey);
    const data: GasApiResponse = await response.json();
    return data.fast;
  } catch (e) {
    console.error("Error getting gas price from API: ", e);
    return null;
  }
};

export default getFastGasPrice;
