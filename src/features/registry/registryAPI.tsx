import * as RegistryContract from "@airswap/registry/build/contracts/Registry.sol/Registry.json";
import registryDeploys from "@airswap/registry/deploys.js";

import { providers, utils, Contract, Event } from "ethers";

const RegistryInterface = new utils.Interface(
  JSON.stringify(RegistryContract.abi)
);

async function getStakerTokens(chainId: number, provider: providers.Provider) {
  const registryContract = new Contract(
    registryDeploys[chainId],
    RegistryInterface,
    provider
  );

  const addTokensEventFilter = registryContract.filters.AddTokens();
  const removeTokensEventFilter = registryContract.filters.RemoveTokens();

  // Fetch all AddTokens and RemoveTokens events from the registry
  const [addEvents, removeEvents] = await Promise.all([
    registryContract.queryFilter(addTokensEventFilter),
    registryContract.queryFilter(removeTokensEventFilter),
  ]);

  // Order matters here, so order AddTokens and RemoveTokens chronologically
  const sortedEvents: Event[] = [...addEvents, ...removeEvents]
    .filter((log) => !log.removed)
    .sort((a, b) => {
      // Sort by oldest first. If they're not in the same block, sort based
      // on blocknumber
      if (a.blockNumber !== b.blockNumber) return a.blockNumber - b.blockNumber;
      // if in the same block, sort by the index of the log in the block
      return a.logIndex - b.logIndex;
    });

  // Hold a list of tokens for each staker.
  const stakerTokens: Record<string, string[]> = {};

  sortedEvents.forEach((log) => {
    if (!log.args) return;
    // @ts-ignore (args are not typed)
    const [staker, tokens] = log.args as [string, string[]];
    const lowerCasedTokens = tokens.map((t) => t.toLowerCase());
    if (log.event === "AddTokens") {
      // Adding tokens
      stakerTokens[staker] = (stakerTokens[staker] || []).concat(
        lowerCasedTokens
      );
    } else {
      // Removing tokens
      stakerTokens[staker] = (stakerTokens[staker] || []).filter(
        (token) => !lowerCasedTokens.includes(token)
      );
    }
  });

  return stakerTokens;
}

export { getStakerTokens };
