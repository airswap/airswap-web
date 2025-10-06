import { Delegate } from "@airswap/libraries";
import {
  ADDRESS_ZERO,
  createOrderERC20,
  getCostByRule,
  TokenInfo,
} from "@airswap/utils";
import { BaseProvider, Web3Provider } from "@ethersproject/providers";

import { AppDispatch } from "../../app/store";
import { notifyRejectedByUserError } from "../../components/Toasts/ToastController";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import {
  getDelegateRuleCall,
  getSwapErc20ContractAddress,
  takeDelegateRuleCall,
} from "../../entities/DelegateRule/DelegateRuleService";
import { transformToSubmittedDelegateSwapTransaction } from "../../entities/SubmittedTransaction/SubmittedTransactionTransformers";
import { AppErrorType } from "../../errors/appError";
import { isAppError } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import toAtomicString from "../../helpers/toAtomicString";
import { submitTransaction } from "../transactions/transactionsActions";
import { setDelegateRule, setError, setStatus } from "./takeLimitSlice";

type GetDelegateOrderParams = {
  senderWallet: string;
  senderToken: string;
  signerToken: string;
  chainId: number;
  library: BaseProvider;
};

export const getDelegateOrder =
  (params: GetDelegateOrderParams) => async (dispatch: AppDispatch) => {
    try {
      const delegateRule = await getDelegateRuleCall(params);

      if (!delegateRule) {
        dispatch(setStatus("invalid"));

        return;
      }

      if (delegateRule.senderWallet === ADDRESS_ZERO) {
        dispatch(setStatus("not-found"));

        return;
      }

      dispatch(setDelegateRule(delegateRule));
      dispatch(setStatus("open"));
    } catch (error) {
      console.error(error);

      dispatch(setStatus("failed"));
    }
  };

type TakeLimitOrderParams = {
  delegateRule: DelegateRule;
  protocolFee: number;
  signerWallet: string;
  signerAmount: string;
  senderAmount: string;
  signerTokenInfo: TokenInfo;
  senderTokenInfo: TokenInfo;
  library: Web3Provider;
};

export const takeLimitOrder =
  (params: TakeLimitOrderParams) => async (dispatch: AppDispatch) => {
    try {
      const { delegateRule, protocolFee, signerWallet, library } = params;

      const senderAmount = toAtomicString(
        params.senderAmount,
        params.senderTokenInfo.decimals
      );

      if (isAppError(senderAmount)) {
        dispatch(setStatus("failed"));
        dispatch(setError(senderAmount));
        return;
      }

      const signerAmount = getCostByRule(
        senderAmount,
        delegateRule.senderAmount,
        delegateRule.signerAmount
      );

      const swapErc20ContractAddress = await getSwapErc20ContractAddress(
        library,
        delegateRule.chainId
      );

      const unsignedOrder = createOrderERC20({
        expiry: delegateRule.expiry,
        nonce: Date.now().toString(),
        senderWallet: Delegate.getAddress(delegateRule.chainId),
        signerWallet: signerWallet,
        signerToken: delegateRule.signerToken,
        senderToken: delegateRule.senderToken,
        protocolFee,
        signerAmount,
        senderAmount,
        chainId: delegateRule.chainId,
      });

      dispatch(setStatus("signing-signature"));

      const signature = await createOrderERC20Signature(
        unsignedOrder,
        library.getSigner(),
        swapErc20ContractAddress,
        delegateRule.chainId
      );

      if (isAppError(signature)) {
        if (signature.type === AppErrorType.rejectedByUser) {
          dispatch(setStatus("open"));
          notifyRejectedByUserError();
        } else {
          dispatch(setStatus("failed"));
          dispatch(setError(signature));
        }
        return;
      }

      dispatch(setStatus("signing-transaction"));

      const tx = await takeDelegateRuleCall({
        delegateRule,
        library,
        signature,
        signerWallet,
        unsignedOrder,
      });

      if (!tx.hash) {
        console.error("Transaction hash is missing.");

        dispatch(setStatus("failed"));

        return;
      }

      dispatch(setStatus("open"));

      const submittedTransaction = transformToSubmittedDelegateSwapTransaction(
        tx.hash,
        unsignedOrder,
        delegateRule,
        params.senderTokenInfo,
        params.signerTokenInfo
      );

      dispatch(submitTransaction(submittedTransaction));
    } catch (error) {
      console.error(error);

      const appError = transformUnknownErrorToAppError(error);

      if (appError.type === AppErrorType.rejectedByUser) {
        dispatch(setStatus("open"));
        notifyRejectedByUserError();

        return;
      }

      dispatch(setStatus("failed"));
      dispatch(setError(appError));
    }
  };
