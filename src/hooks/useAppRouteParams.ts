import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import {
  transformAddressToAddressAlias,
  transformAddressAliasToAddress,
} from "../constants/addressAliases";
import { AppRoutes, SwapRoutes } from "../routes";
import useSearchParams from "./useSearchParams";

export interface AppRouteParams {
  route?: AppRoutes;
  isLimitOrder?: boolean;
  tokenFrom?: string;
  tokenTo?: string;
  tokenFromAlias?: string;
  tokenToAlias?: string;
  /**
   * Url from useRouteMatch
   */
  url: string;
}

// TODO: Add isLimitOrder to AppRouteParams

const useAppRouteParams = (): AppRouteParams => {
  const routeMatch = useRouteMatch<{ route?: string }>(`/:route`);
  const isLimitOrder = !!useSearchParams("limit");
  const { chainId } = useAppSelector((state) => state.web3);

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
        isLimitOrder,
        justifiedBaseUrl: "",
      };
    }
  }, [swapMatch, chainId]);

  const routeMatchData = useMemo(() => {
    if (routeMatch) {
      return {
        route: routeMatch.params.route as AppRoutes,
        url: routeMatch.url,
        isLimitOrder,
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
