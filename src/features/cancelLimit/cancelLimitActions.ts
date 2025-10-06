import { TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";

import { AppDispatch } from "../../app/store";
import { notifyRejectedByUserError } from "../../components/Toasts/ToastController";
import { cancelDelegateRuleCall } from "../../entities/DelegateRule/DelegateRuleService";
import { transformToSubmittedUnsetRuleTransaction } from "../../entities/SubmittedTransaction/SubmittedTransactionTransformers";
import { AppErrorType } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import { TransactionStatusType } from "../../types/transactionTypes";
import { setError } from "../takeLimit/takeLimitSlice";
import { submitTransaction } from "../transactions/transactionsActions";
import { setStatus } from "./cancelLimitSlice";

type CancelLimitOrderParams = {
  senderWallet: string;
  signerTokenInfo: TokenInfo;
  senderTokenInfo: TokenInfo;
  chainId: number;
  library: Web3Provider;
};

export const cancelLimitOrder =
  (params: CancelLimitOrderParams) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setStatus("signing"));

      const tx = await cancelDelegateRuleCall({
        ...params,
        senderToken: params.senderTokenInfo.address,
        signerToken: params.signerTokenInfo.address,
      });

      if (!tx.hash) {
        console.error("Transaction hash is missing.");

        dispatch(setStatus("failed"));

        return;
      }

      const submittedTransaction = transformToSubmittedUnsetRuleTransaction(
        tx.hash,
        params.senderTokenInfo,
        params.signerTokenInfo,
        params.senderWallet,
        TransactionStatusType.processing
      );

      dispatch(submitTransaction(submittedTransaction));

      dispatch(setStatus("idle"));
    } catch (error) {
      const appError = transformUnknownErrorToAppError(error);

      if (appError.type === AppErrorType.rejectedByUser) {
        dispatch(setStatus("idle"));
        notifyRejectedByUserError();

        return;
      }

      console.error(error);

      dispatch(setStatus("failed"));
      dispatch(setError(appError));
    }
  };
