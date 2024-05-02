import { useContext, useEffect } from "react";
import useKonami from "react-use-konami";

import { ProtocolIds } from "@airswap/utils";

import { useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";

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
  } = useAppSelector((state) => state.quotes);
  const { isLoading: isGasCostLoading, swapTransactionCost } = useAppSelector(
    (state) => state.gasCost
  );

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
  }, [bestQuote]);
};

export default useQuotesDebug;
