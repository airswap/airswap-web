import { Delegate, Swap } from "@airswap/libraries";
import {
  createOrder,
  createOrderERC20,
  toAtomicString,
  FullOrderERC20,
  UnsignedOrderERC20,
  TokenInfo,
  FullOrder,
  TokenKinds,
  UnsignedOrder,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";

import { ethers } from "ethers";

import { AppDispatch } from "../../app/store";
import { notifyRejectedByUserError } from "../../components/Toasts/ToastController";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  isCollectionTokenInfo,
  getTokenKind,
  getTokenDecimals,
  isTokenInfo,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { transformToDelegateRule } from "../../entities/DelegateRule/DelegateRuleTransformers";
import { SubmittedSetRuleTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { AppErrorType, isAppError } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import { getSwapErc20Address } from "../../helpers/swapErc20";
import {
  TransactionStatusType,
  TransactionTypes,
} from "../../types/transactionTypes";
import { sendOrderToIndexers } from "../indexer/indexerHelpers";
import { submitTransaction } from "../transactions/transactionsActions";
import { createOrderSignature } from "./makeOrderHelpers";
import { setError, setStatus, setOtcOrder } from "./makeOrderSlice";

const getJustifiedAddress = async (library: Web3Provider, address: string) => {
  return ethers.utils.isAddress(address)
    ? address
    : await library.resolveName(address);
};

type CreateFullOrderParams = {
  isLimitOrder: boolean;
  activeIndexers: string[] | null;
  chainId: number;
  library: Web3Provider;
  signerTokenInfo: AppTokenInfo;
  senderTokenInfo: AppTokenInfo;
  shouldSendToIndexers: boolean;
} & Omit<UnsignedOrder, "affiliateWallet" | "affiliateAmount">;

type CreateErc20OrderParams = CreateFullOrderParams & {
  signerTokenInfo: TokenInfo;
  senderTokenInfo: TokenInfo;
};
const createDelegateRule = async (
  params: CreateFullOrderParams,
  dispatch: AppDispatch
): Promise<SubmittedSetRuleTransaction | undefined> => {
  if (
    isCollectionTokenInfo(params.signerTokenInfo) ||
    isCollectionTokenInfo(params.senderTokenInfo)
  ) {
    throw new Error("Delegate rules are not supported for nft's");
  }

  const senderAmount = toAtomicString(
    params.sender.amount,
    params.senderTokenInfo.decimals
  );

  const signerAmount = toAtomicString(
    params.signer.amount,
    params.signerTokenInfo.decimals
  );

  const delegateContract = Delegate.getContract(
    params.library.getSigner(),
    params.chainId
  );

  // For a delegate rule, the sender and signer are reversed compared to an otc order
  const rule = transformToDelegateRule(
    params.signer.wallet,
    params.signer.token,
    signerAmount,
    params.sender.token,
    senderAmount,
    params.chainId,
    Number(params.expiry)
  );

  dispatch(setStatus("signing"));

  try {
    const tx = await delegateContract.setRule(
      rule.senderWallet,
      rule.senderToken,
      rule.senderAmount,
      rule.signerToken,
      rule.signerAmount,
      rule.expiry
    );

    const transaction: SubmittedSetRuleTransaction = {
      type: TransactionTypes.setDelegateRule,
      rule,
      hash: tx.hash,
      timestamp: Date.now(),
      status: TransactionStatusType.processing,
      signerToken: params.senderTokenInfo,
      senderToken: params.signerTokenInfo,
    };

    dispatch(submitTransaction(transaction));
    dispatch(setStatus("idle"));

    return transaction;
  } catch (error) {
    const appError = transformUnknownErrorToAppError(error);
    if (appError.type === AppErrorType.rejectedByUser) {
      dispatch(setStatus("idle"));
      notifyRejectedByUserError();
    } else {
      dispatch(setStatus("failed"));
      dispatch(setError(appError));
    }

    return;
  }
};

const createOtcFullOrder = async (
  params: CreateFullOrderParams,
  dispatch: AppDispatch
): Promise<undefined> => {
  const signerTokenDecimals = getTokenDecimals(params.signerTokenInfo);
  const senderTokenDecimals = getTokenDecimals(params.senderTokenInfo);

  const signerTokenKind = getTokenKind(params.signerTokenInfo);
  const senderTokenKind = getTokenKind(params.senderTokenInfo);

  const signerAmount = toAtomicString(
    params.signer.amount,
    signerTokenDecimals
  );

  const senderAmount = toAtomicString(
    params.sender.amount,
    senderTokenDecimals
  );

  const unsignedOrder = createOrder({
    expiry: params.expiry,
    nonce: Date.now(),
    protocolFee: Number(params.protocolFee),
    signer: {
      ...params.signer,
      amount: params.signer.kind !== TokenKinds.ERC721 ? signerAmount : "0",
      token: params.signer.token,
      type: signerTokenKind,
    },
    sender: {
      ...params.sender,
      amount: senderAmount,
      type: senderTokenKind,
    },
  });

  dispatch(setStatus("signing"));

  const signature = await createOrderSignature(
    unsignedOrder,
    params.library.getSigner(),
    Swap.getAddress(params.chainId) || "",
    params.chainId
  );

  if (isAppError(signature)) {
    if (signature.type === AppErrorType.rejectedByUser) {
      dispatch(setStatus("idle"));
      notifyRejectedByUserError();
    } else {
      dispatch(setStatus("failed"));
      dispatch(setError(signature));
    }
    return;
  }

  const fullOrder: FullOrder = {
    ...unsignedOrder,
    ...signature,
    chainId: params.chainId,
    swapContract: Swap.getAddress(params.chainId) || "",
  };

  if (params.shouldSendToIndexers && params.activeIndexers) {
    sendOrderToIndexers(fullOrder, params.activeIndexers);
  }

  dispatch(setStatus("idle"));
  dispatch(setOtcOrder(fullOrder));

  return;
};

const createOtcErc20Order = async (
  params: CreateErc20OrderParams,
  dispatch: AppDispatch
): Promise<undefined> => {
  const signerAmount = toAtomicString(
    params.signer.amount,
    params.signerTokenInfo.decimals
  );

  const senderAmount = toAtomicString(
    params.sender.amount,
    params.senderTokenInfo.decimals
  );

  const unsignedOrder = createOrderERC20({
    expiry: params.expiry,
    nonce: Date.now().toString(),
    senderWallet: params.sender.wallet,
    signerWallet: params.signer.wallet,
    signerToken: params.signer.token,
    senderToken: params.sender.token,
    protocolFee: params.protocolFee,
    signerAmount,
    senderAmount,
    chainId: params.chainId,
  });

  dispatch(setStatus("signing"));

  const signature = await createOrderERC20Signature(
    unsignedOrder,
    params.library.getSigner(),
    getSwapErc20Address(params.chainId) || "",
    params.chainId
  );

  if (isAppError(signature)) {
    if (signature.type === AppErrorType.rejectedByUser) {
      dispatch(setStatus("idle"));
      notifyRejectedByUserError();
    } else {
      dispatch(setStatus("failed"));
      dispatch(setError(signature));
    }
    return;
  }

  const fullOrder: FullOrderERC20 = {
    ...unsignedOrder,
    ...signature,
    chainId: params.chainId,
    swapContract: getSwapErc20Address(params.chainId) || "",
  };

  if (params.shouldSendToIndexers && params.activeIndexers) {
    sendOrderToIndexers(fullOrder, params.activeIndexers);
  }

  dispatch(setStatus("idle"));
  dispatch(setOtcOrder(fullOrder));

  return;
};

export const createOtcOrDelegateOrder =
  (params: CreateFullOrderParams) =>
  async (
    dispatch: AppDispatch
  ): Promise<SubmittedSetRuleTransaction | undefined> => {
    try {
      const [signerWallet, senderWallet] = await Promise.all([
        getJustifiedAddress(params.library, params.signer.wallet),
        getJustifiedAddress(params.library, params.sender.wallet),
      ]);

      if (!signerWallet || !senderWallet) {
        dispatch(setStatus("failed"));
        dispatch(
          setError({
            type: AppErrorType.invalidAddress,
            argument: params.signer.wallet,
          })
        );
        return;
      }

      const justifiedParams: CreateFullOrderParams = {
        ...params,
        signer: {
          ...params.signer,
          wallet: signerWallet,
        },
        sender: {
          ...params.sender,
          wallet: senderWallet,
        },
      };

      if (params.isLimitOrder) {
        return createDelegateRule(justifiedParams, dispatch as AppDispatch);
      }

      if (
        isTokenInfo(params.signerTokenInfo) &&
        isTokenInfo(params.senderTokenInfo)
      ) {
        return createOtcErc20Order(
          justifiedParams as CreateErc20OrderParams,
          dispatch as AppDispatch
        );
      }

      return createOtcFullOrder(justifiedParams, dispatch as AppDispatch);
    } catch (error) {
      console.error(error);
      dispatch(setStatus("failed"));
      dispatch(setError({ type: AppErrorType.unknownError }));
    }
  };
