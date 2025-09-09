import { useEffect, useState } from "react";

import { Delegate } from "@airswap/libraries";
import { Contract } from "@ethersproject/contracts";
import { useAsync } from "@react-hookz/web/esm";
import { IAsyncState } from "@react-hookz/web/esm/useAsync/useAsync";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, Event } from "ethers";

import { DelegateRule } from "../../../entities/DelegateRule/DelegateRule";
import {
  getDelegateContract,
  getUniqueDelegateRules,
} from "../../../entities/DelegateRule/DelegateRuleHelpers";
import { transformToDelegateRule } from "../../../entities/DelegateRule/DelegateRuleTransformers";
import getContractEvents from "../../../helpers/getContractEvents";
import useNetworkSupported from "../../../hooks/useNetworkSupported";

interface SetRuleLogs {
  delegateRules: DelegateRule[];
  chainId: number;
  account: string;
}

const isSetRuleLog = (log: Event): log is Event & { args: any[] } => {
  return log.args !== undefined && Array.isArray(log.args);
};

const useSetRuleLogs = (
  chainId?: number,
  account?: string | null
): IAsyncState<SetRuleLogs | null> => {
  const { provider } = useWeb3React();
  const isNetworkSupported = useNetworkSupported();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();

  const [state, actions] = useAsync(
    async (delegateContract: Contract, account: string) => {
      const setRuleFilter = delegateContract.filters.SetRule(null);

      const firstTxBlockDelegateContract =
        chainId && Delegate.deployedBlocks[chainId];
      const currentBlock = await provider?.getBlockNumber();

      if (!firstTxBlockDelegateContract || !currentBlock) {
        throw new Error("Could not get block numbers");
      }

      const setRuleLogs = await getContractEvents(
        delegateContract,
        setRuleFilter,
        firstTxBlockDelegateContract,
        currentBlock
      );

      const delegateRules = setRuleLogs
        .filter(isSetRuleLog)
        .filter((log) => log.args[0] === account)
        .map((log) =>
          transformToDelegateRule(
            log.args[0],
            log.args[1],
            (log.args[2] as BigNumber).toString(),
            log.args[3],
            (log.args[4] as BigNumber).toString(),
            chainId,
            (log.args[5] as BigNumber).toNumber()
          )
        );

      const uniqueDelegateRules = getUniqueDelegateRules(delegateRules);

      return {
        delegateRules: uniqueDelegateRules,
        chainId,
        account,
      };
    },
    null
  );

  useEffect(() => {
    if (!chainId || !account || !provider || !isNetworkSupported) return;

    if (account === accountState && chainId === chainIdState) return;

    const delegateContract = getDelegateContract(provider, chainId);

    // TODO: #1047, remove this once we have a contract for all chains
    if (!delegateContract) {
      return;
    }

    actions.execute(delegateContract, account);

    setAccountState(account);
    setChainIdState(chainId);
  }, [chainId, account, provider, actions, isNetworkSupported]);

  return state;
};

export default useSetRuleLogs;
