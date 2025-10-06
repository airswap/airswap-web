import { AppDispatch, RootState } from "../../app/store";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import { getUniqueDelegateRules } from "../../entities/DelegateRule/DelegateRuleHelpers";
import { isUnsetRuleTransaction } from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { getUniqueSingleDimensionArray } from "../../helpers/array";
import { compareAddresses } from "../../helpers/string";
import { setTransactions } from "../transactions/transactionsSlice";
import { writeDismissedDelegateRulesToLocalStorage } from "./delegateRulesHelpers";
import {
  setDelegateRules,
  setDismissedDelegateRuleIds,
} from "./delegateRulesSlice";

export const submitDelegateRuleToStore =
  (newDelegateRule: DelegateRule) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    const { delegateRules } = state.delegateRules;
    const { transactions } = state.transactions;

    if (delegateRules.some((rule) => rule.id === newDelegateRule.id)) {
      console.warn(
        "[submitDelegateRuleToStore]: delegateRule already exists in store"
      );

      return;
    }

    const updatedDelegateRules = getUniqueDelegateRules([
      ...delegateRules,
      newDelegateRule,
    ]);

    const updatedTransactions = transactions.map((transaction) => {
      if (
        isUnsetRuleTransaction(transaction) &&
        compareAddresses(
          transaction.senderToken.address,
          newDelegateRule.senderToken
        ) &&
        compareAddresses(
          transaction.signerToken.address,
          newDelegateRule.signerToken
        ) &&
        compareAddresses(transaction.senderWallet, newDelegateRule.senderWallet)
      ) {
        return { ...transaction, isOverridden: true };
      }

      return transaction;
    });

    dispatch(setDelegateRules(updatedDelegateRules));
    dispatch(setTransactions(updatedTransactions));
  };

type UnsetDelegateRuleFromStoreProps = {
  chainId: number;
  senderWallet: string;
  senderToken: string;
  signerToken: string;
};

export const unsetDelegateRuleFromStore =
  (props: UnsetDelegateRuleFromStoreProps) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    const { chainId, senderWallet, senderToken, signerToken } = props;

    const filteredDelegateRules = state.delegateRules.delegateRules.filter(
      (rule) =>
        !(
          rule.chainId === chainId &&
          compareAddresses(rule.senderWallet, senderWallet) &&
          compareAddresses(rule.senderToken, senderToken) &&
          compareAddresses(rule.signerToken, signerToken)
        )
    );

    if (
      filteredDelegateRules.length === state.delegateRules.delegateRules.length
    ) {
      console.warn(
        "[unsetDelegateRuleFromStore]: delegateRule not found in store"
      );

      return;
    }

    dispatch(setDelegateRules(filteredDelegateRules));
  };

export const dismissDelegateRule =
  (delegateRule: DelegateRule) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const { delegateRules, web3 } = getState();

    if (!web3.account || !web3.chainId) {
      console.warn(
        "[dismissDelegateRule]: account or chainId not found in web3"
      );

      return;
    }

    const { dismissedDelegateRuleIds } = delegateRules;

    const updatedDismissedDelegateRuleIds = [
      ...dismissedDelegateRuleIds,
      delegateRule.id,
    ].filter(getUniqueSingleDimensionArray);

    writeDismissedDelegateRulesToLocalStorage(
      updatedDismissedDelegateRuleIds,
      web3.account,
      web3.chainId
    );

    dispatch(setDismissedDelegateRuleIds(updatedDismissedDelegateRuleIds));
  };
