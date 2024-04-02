import { Contract, Event, EventFilter } from "ethers";

const getBlockLimitFromErrorMessage = (message: string): number | false => {
  const match = message.match(/\d+/);

  return match ? parseInt(match[0]) : false;
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
        const message = error?.data?.message;
        const blockLimit = message
          ? getBlockLimitFromErrorMessage(message)
          : false;

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
