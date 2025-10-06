import { useMemo, useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import { DelegateRule } from "../../../entities/DelegateRule/DelegateRule";
import useNativeToken from "../../../hooks/useNativeToken";
import { selectAllTokenInfo } from "../../metadata/metadataSlice";
import useSetRuleLogs from "../hooks/useSetRuleLogs";

interface HistoricalDelegateRulesCollection {
  chainId: number;
  account: string;
  delegateRules: DelegateRule[];
}

export const useHistoricalDelegateRules = () => {
  const { account, chainId } = useAppSelector((state) => state.web3);

  const { result: setRuleLogs, status } = useSetRuleLogs(chainId, account);

  const tokens = useAppSelector(selectAllTokenInfo);
  const nativeToken = useNativeToken(chainId);
  const allTokens = [nativeToken, ...tokens];

  const [isLoading, setIsLoading] = useState(false);
  const [delegateRules, setDelegateRules] =
    useState<HistoricalDelegateRulesCollection>();

  useMemo(() => {
    if (
      !chainId ||
      !setRuleLogs ||
      status === "loading" ||
      setRuleLogs.chainId !== chainId ||
      setRuleLogs.account !== account
    ) {
      return;
    }

    setIsLoading(true);
    setDelegateRules(undefined);

    const getDelegateRulesFromLogs = async () => {
      setIsLoading(false);
    };

    getDelegateRulesFromLogs();
  }, [setRuleLogs, status]);

  return [delegateRules, isLoading];
};
