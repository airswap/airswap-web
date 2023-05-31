import { useMemo } from "react";
import { useLocation } from "react-router";
import { useRouteMatch } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import {
  transformAddressToAddressAlias,
  transformAddressAliasToAddress,
} from "../constants/addressAliases";
import { AppRoutes, SwapRoutes } from "../routes";
import useSearchParams from "./useSearchParams";

export interface AppRouteParams {
  route?: AppRoutes;
  tokenFrom?: string;
  tokenTo?: string;
  tokenFromAlias?: string;
  tokenToAlias?: string;
  /**
   * Url from useRouteMatch
   */
  url: string;
  queryString?: string | null;
}

const useAppRouteParams = (): AppRouteParams => {
  const routeMatch = useRouteMatch<{ routeOrLang?: string }>(`/:routeOrLang`);
  const { chainId } = useWeb3React<Web3Provider>();
  const location = useLocation();
  const queryString = useSearchParams(location);

  const swapMatch = useRouteMatch<{
    route?: AppRoutes.swap;
    tokenFrom?: string;
    tokenTo?: string;
  }>(`/:route/:${SwapRoutes.tokenFrom}/:${SwapRoutes.tokenTo}`);

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
        tokenFromAlias: tokenFromAlias,
        tokenToAlias: tokenToAlias,
        route: swapMatch.params.route,
        url: swapMatch.url,
        justifiedBaseUrl: "",
        queryString,
      };
    }
  }, [swapMatch, chainId, queryString]);

  const routeMatchData = useMemo(() => {
    if (routeMatch) {
      return {
        route: routeMatch.params.routeOrLang as AppRoutes,
        url: routeMatch.url,
      };
    }
  }, [routeMatch]);

  if (swapMatchData) {
    console.log("swapMatchData", swapMatchData);
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
