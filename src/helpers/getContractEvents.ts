import { Contract, Event, EventFilter } from "ethers";

export interface BlockLimitError {
  code: -32005;
  message: string;
  data: {
    from: string;
    limit: number;
    to: string;
  };
}

export interface BlockLimitErrorVariant {
  code: number;
  data: {
    message: string;
  };
}

export const getBlockLimitFromError = (
  error: BlockLimitError | BlockLimitErrorVariant
): number | undefined => {
  if (!error.data) {
    return;
  }

  if ("limit" in error.data) {
    return error.data.limit;
  }

  if (!error.data?.message) {
    return;
  }

  const match = error.data.message.match(/\d+/);

  return match ? parseInt(match[0]) : undefined;
};

const getContractQueryFilterInIncrements = async (
  contract: Contract,
  filter: EventFilter,
  startBlock: number,
  endBlock: number,
  increment: number
): Promise<Event[]> => {
  let events: Event[] = [];
  let currentStartBlock = startBlock;
  let currentEndBlock = startBlock + increment;

  while (currentEndBlock - increment < endBlock && !events.length) {
    events = await contract.queryFilter(
      filter,
      currentStartBlock,
      currentEndBlock
    );
    currentStartBlock += increment;
    currentEndBlock += increment;
  }

  return events;
};

export const getContractEvents = (
  contract: Contract,
  filter: EventFilter,
  startBlock: number,
  endBlock: number
): Promise<Event[]> =>
  new Promise((resolve) => {
    contract
      .queryFilter(filter, startBlock, endBlock)
      .then((events) => {
        resolve(events);
      })
      .catch(async (error) => {
        const blockLimit = error ? getBlockLimitFromError(error) : false;

        if (!blockLimit) {
          console.error(
            "[getContractQueryFilter]: Error when getting logs, but no block limit could be found",
            error
          );

          resolve([]);

          return;
        }

        const events = getContractQueryFilterInIncrements(
          contract,
          filter,
          startBlock,
          endBlock,
          blockLimit
        );

        resolve(events);
      });
  });

export default getContractEvents;
