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
  error: BlockLimitError | BlockLimitErrorVariant | Error
): number | undefined => {
  if ("data" in error && "limit" in error.data) {
    return error.data.limit;
  }

  const message = "message" in error ? error.message : error.data?.message;

  if (!message) {
    return;
  }

  const match = message.match(/\d+/);

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
            `[getContractQueryFilter]: Error when getting logs (${startBlock} to ${endBlock}) but no block limit could be found`,
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
