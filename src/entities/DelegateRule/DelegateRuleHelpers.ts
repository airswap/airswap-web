import { Delegate } from "@airswap/libraries";
import {
  JsonRpcProvider,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";

import { compareAddresses } from "../../helpers/string";
import { TransactionEvent } from "../../types/transactionTypes";
import {
  SubmittedDelegatedSwapTransaction,
  SubmittedSetRuleTransaction,
  SubmittedUnsetRuleTransaction,
} from "../SubmittedTransaction/SubmittedTransaction";
import {
  DelegateRule,
  DelegateSetRuleEvent,
  DelegateUnsetRuleEvent,
  DelegatedSwapEvent,
} from "./DelegateRule";

export const isDelegateRule = (value: any): value is DelegateRule =>
  typeof value === "object" &&
  "senderWallet" in value &&
  "senderToken" in value &&
  "signerToken" in value;

export const isDelegateSetRuleEvent = (
  event: TransactionEvent
): event is DelegateSetRuleEvent =>
  typeof event === "object" && "name" in event && event.name === "SetRule";

export const isUnsetRuleEvent = (
  event: TransactionEvent
): event is DelegateUnsetRuleEvent =>
  typeof event === "object" && "name" in event && event.name === "UnsetRule";

export const isDelegatedSwapEvent = (
  event: TransactionEvent
): event is DelegatedSwapEvent =>
  typeof event === "object" &&
  "name" in event &&
  event.name === "DelegatedSwapFor";

export const findMatchingDelegateSetRuleTransaction = (
  transaction: SubmittedSetRuleTransaction,
  event: DelegateSetRuleEvent
): boolean => {
  return (
    compareAddresses(transaction.rule.senderWallet, event.senderWallet) &&
    compareAddresses(transaction.rule.senderToken, event.senderToken) &&
    transaction.rule.senderAmount === event.senderAmount &&
    compareAddresses(transaction.rule.signerToken, event.signerToken) &&
    transaction.rule.signerAmount === event.signerAmount &&
    transaction.rule.expiry === event.expiry &&
    transaction.rule.chainId === event.chainId
  );
};

export const findMatchingUnsetRuleTransaction = (
  transaction: SubmittedUnsetRuleTransaction,
  event: DelegateUnsetRuleEvent
): boolean => {
  return (
    compareAddresses(transaction.senderWallet, event.senderWallet) &&
    compareAddresses(transaction.senderToken.address, event.senderToken) &&
    compareAddresses(transaction.signerToken.address, event.signerToken) &&
    transaction.chainId === event.chainId
  );
};

export const findMatchingDelegatedSwapTransaction = (
  transaction: SubmittedDelegatedSwapTransaction,
  event: DelegatedSwapEvent
): boolean => {
  return (
    compareAddresses(
      transaction.delegateRule.senderWallet,
      event.senderWallet
    ) &&
    compareAddresses(transaction.order.signerWallet, event.signerWallet) &&
    transaction.order.nonce === event.nonce &&
    transaction.delegateRule.chainId === event.chainId
  );
};

/**
 * Get unique delegate rules by senderWallet, senderToken and signerToken sorted by latest order index
 * @param rules
 * @returns
 */

export const getUniqueDelegateRules = (rules: DelegateRule[]) => {
  return Object.values(
    rules.reduce((acc, r, index) => {
      const rule = rules[rules.length - index - 1];
      const key = `${rule.senderWallet}-${rule.senderToken}-${rule.signerToken}`;

      if (acc[key]) {
        return acc;
      }

      acc[key] = rule;

      return acc;
    }, {} as Record<string, DelegateRule>)
  );
};

export const getDelegateContract = (
  provider: Web3Provider | JsonRpcSigner,
  chainId: number
) => {
  try {
    return Delegate.getContract(provider, chainId);
  } catch {
    console.error(
      `[getDelegateContract]: Missing contract for chainId ${chainId}`
    );

    return null;
  }
};
