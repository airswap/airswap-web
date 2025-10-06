import { Delegate } from "@airswap/libraries";
import { Signature, UnsignedOrderERC20 } from "@airswap/utils";
import { BaseProvider, Web3Provider } from "@ethersproject/providers";

import { Transaction } from "ethers";

import { transformToSubmittedDelegateSwapTransaction } from "../SubmittedTransaction/SubmittedTransactionTransformers";
import { DelegateRule } from "./DelegateRule";
import { transformToDelegateRule } from "./DelegateRuleTransformers";

type GetDelegateRuleParams = {
  senderWallet: string;
  senderToken: string;
  signerToken: string;
  chainId: number;
  library: BaseProvider;
};

export const getDelegateRuleCall = async (
  params: GetDelegateRuleParams
): Promise<DelegateRule> => {
  const delegateContract = Delegate.getContract(params.library, params.chainId);

  const response = await delegateContract.rules(
    params.senderWallet,
    params.senderToken,
    params.signerToken
  );

  const delegateRule = transformToDelegateRule(
    response.senderWallet,
    response.senderToken.toString(),
    response.senderAmount.toString(),
    response.signerToken.toString(),
    response.signerAmount.toString(),
    params.chainId,
    response.expiry.toString(),
    response.senderFilledAmount.toString()
  );

  return delegateRule;
};

type TakeDelegateRuleParams = {
  delegateRule: DelegateRule;
  signature: Signature;
  signerWallet: string;
  unsignedOrder: UnsignedOrderERC20;
  library: Web3Provider;
};

export const takeDelegateRuleCall = async (
  params: TakeDelegateRuleParams
): Promise<Transaction> => {
  const { delegateRule, signature, unsignedOrder, library } = params;
  const delegateContract = Delegate.getContract(
    library.getSigner(),
    delegateRule.chainId
  );

  return delegateContract.swap(
    delegateRule.senderWallet,
    unsignedOrder.nonce,
    unsignedOrder.expiry,
    unsignedOrder.signerWallet,
    unsignedOrder.signerToken,
    unsignedOrder.signerAmount,
    unsignedOrder.senderToken,
    unsignedOrder.senderAmount,
    signature.v,
    signature.r,
    signature.s
  );
};

type CancelDelegateRuleParams = {
  senderWallet: string;
  senderToken: string;
  signerToken: string;
  chainId: number;
  library: Web3Provider;
};

export const cancelDelegateRuleCall = async (
  params: CancelDelegateRuleParams
): Promise<Transaction> => {
  const { senderWallet, senderToken, signerToken, chainId, library } = params;
  const delegateContract = Delegate.getContract(library.getSigner(), chainId);

  return delegateContract.unsetRule(senderWallet, senderToken, signerToken);
};

export const getSwapErc20ContractAddress = (
  library: Web3Provider,
  chainId: number
) => {
  const delegateContract = Delegate.getContract(library, chainId);

  return delegateContract.swapERC20Contract();
};
