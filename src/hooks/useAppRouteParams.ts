import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import {
  transformAddressToAddressAlias,
  transformAddressAliasToAddress,
} from "../constants/addressAliases";
import { AppRoutes, SwapRoutes } from "../routes";

export interface AppRouteParams {
  route?: AppRoutes;
  tokenFrom?: string;
  tokenTo?: string;
  viewAllQuotesAmount?: string;
  tokenFromAlias?: string;
  tokenToAlias?: string;
  /**
   * Url from useRouteMatch
   */
  url: string;
}

const useAppRouteParams = (): AppRouteParams => {
  const routeMatch = useRouteMatch<{ routeOrLang?: string }>(`/:routeOrLang`);
  const { chainId } = useWeb3React<Web3Provider>();

  const swapMatch = useRouteMatch<{
    route?: AppRoutes.swap;
    tokenFrom?: string;
    tokenTo?: string;
    viewAllQuotesAmount?: string;
  }>(
    `/:route/:${SwapRoutes.tokenFrom}/:${SwapRoutes.tokenTo}/:${SwapRoutes.viewAllQuotesAmount}`
  );

  const swapMatchData = useMemo(() => {
    if (swapMatch) {
      const tokenFrom = transformAddressAliasToAddress(
        swapMatch.params.tokenFrom,
        chainId
      );
      const tokenTo = transformAddressAliasToAddress(
        swapMatch.params.tokenTo,
        chainId
      );
      const tokenFromAlias = transformAddressToAddressAlias(tokenFrom, chainId);
      const tokenToAlias = transformAddressToAddressAlias(tokenTo, chainId);

      return {
        tokenFrom,
        tokenTo,
        viewAllQuotesAmount: swapMatch.params.viewAllQuotesAmount,
        tokenFromAlias: tokenFromAlias,
        tokenToAlias: tokenToAlias,
        route: swapMatch.params.route,
        url: swapMatch.url,
        justifiedBaseUrl: "",
      };
    }
  }, [swapMatch, chainId]);

  const routeMatchData = useMemo(() => {
    if (routeMatch) {
      return {
        route: routeMatch.params.routeOrLang as AppRoutes,
        url: routeMatch.url,
      };
    }
  }, [routeMatch]);

  if (swapMatchData) {
    return swapMatchData;
  }

  if (routeMatchData) {
    return routeMatchData;
  }

  return {
    url: "",
  };
};

export default useAppRouteParams;
