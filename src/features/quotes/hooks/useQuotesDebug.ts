import { useContext, useEffect } from "react";
import useKonami from "react-use-konami";

import { ProtocolIds } from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";

import BigNumber from "bignumber.js";

import { useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { getTokenDecimals } from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { selectAllTokenInfo } from "../../metadata/metadataSlice";

const useQuotesDebug = () => {
  const { isDebugMode, setIsDebugMode } = useContext(InterfaceContext);

  useKonami(
    () => {
      setIsDebugMode(true);
    },
    {
      code: ["d", "e", "b", "u", "g"],
    }
  );

  const {
    isLastLookLoading,
    isRfqLoading,
    bestPricing,
    bestRfqOrder,
    bestLastLookOrder,
    bestOrder,
    bestOrderType,
    bestQuote,
    lastLookError,
    rfqError,
    streamedBestPricing,
    streamedLastLookOrder,
  } = useAppSelector((state) => state.quotes);
  const { isLoading: isGasCostLoading, swapTransactionCost } = useAppSelector(
    (state) => state.gasCost
  );
  const tokens = useAppSelector(selectAllTokenInfo);

  const isLoading = isLastLookLoading || isRfqLoading || isGasCostLoading;

  useEffect(() => {
    if (isDebugMode) {
      console.log("=========== Enabled Debug Mode ===========");
    }
  }, [isDebugMode]);

  useEffect(() => {
    if (isDebugMode && isLoading) {
      console.log("=========== Fetching quotes from servers ===========");
    }
  }, [isLoading]);

  useEffect(() => {
    if (isDebugMode && bestPricing) {
      console.log("bestPricing:", bestPricing);
    }
  }, [bestPricing]);

  useEffect(() => {
    if (isDebugMode && streamedLastLookOrder) {
      console.log("streamedLastLookOrder:", streamedLastLookOrder);
    }
  }, [streamedLastLookOrder]);

  useEffect(() => {
    if (isDebugMode && streamedBestPricing) {
      console.log("streamedBestPricing:", streamedBestPricing);
    }
  }, [streamedBestPricing]);

  useEffect(() => {
    if (isDebugMode && bestRfqOrder) {
      console.log("bestRfqOrder:", bestRfqOrder);
    }
  }, [bestRfqOrder]);

  useEffect(() => {
    if (isDebugMode && bestLastLookOrder) {
      console.log("bestLastLookOrder:", bestLastLookOrder);
    }
  }, [bestLastLookOrder]);

  useEffect(() => {
    if (isDebugMode && swapTransactionCost) {
      console.log("swapTransactionCost:", swapTransactionCost);
    }
  }, [swapTransactionCost]);

  useEffect(() => {
    const senderToken = tokens.find(
      (token) => token.address === bestLastLookOrder?.senderToken
    );

    if (
      isDebugMode &&
      bestLastLookOrder &&
      swapTransactionCost &&
      senderToken
    ) {
      const lastLookQuote = formatUnits(
        bestLastLookOrder.senderAmount,
        getTokenDecimals(senderToken)
      );
      const justifiedLastLookQuote = new BigNumber(lastLookQuote)
        .plus(swapTransactionCost)
        .toString();

      console.log(
        "bestLastLookQuote:",
        `${lastLookQuote} + ${swapTransactionCost} (potentially saved gas fees) = ${justifiedLastLookQuote}`
      );
    }
  }, [bestLastLookOrder]);

  useEffect(() => {
    const signerToken = tokens.find(
      (token) => token.address === bestRfqOrder?.signerToken
    );

    if (isDebugMode && bestRfqOrder && signerToken) {
      const lastLookQuote = formatUnits(
        bestRfqOrder.signerAmount,
        getTokenDecimals(signerToken)
      );

      console.log("bestRfqQuote:", lastLookQuote);
    }
  }, [bestRfqOrder]);

  useEffect(() => {
    if (isDebugMode && bestOrder) {
      console.log("%cbestOrder:", "color: green; font-size: 16px;", bestOrder);
    }
  }, [bestOrder]);

  useEffect(() => {
    if (isDebugMode && lastLookError) {
      console.log("%clastLookError:", "color: red;", lastLookError);
    }
  }, [lastLookError]);

  useEffect(() => {
    if (isDebugMode && rfqError) {
      console.log("%crfqError:", "color: red;", rfqError);
    }
  }, [rfqError]);

  useEffect(() => {
    if (isDebugMode && bestQuote) {
      console.log(
        "%cbestQuote:",
        "color: green; font-size: 16px;",
        bestQuote,
        bestOrderType === ProtocolIds.RequestForQuoteERC20
          ? "(RFQ)"
          : "(Last Look)"
      );
    }
  }, [bestOrder]);
};

export default useQuotesDebug;
