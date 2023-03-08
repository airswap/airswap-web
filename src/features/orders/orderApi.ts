import * as WETHContract from "@airswap/balances/build/contracts/WETH9.json";
import { wrappedTokenAddresses } from "@airswap/constants";
import { SwapERC20, Maker, Wrapper } from "@airswap/libraries";
import { FullOrderERC20, OrderERC20 } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";

import erc20Abi from "erc-20-abi";
import {
  BigNumber,
  constants,
  Contract,
  ethers,
  providers,
  Transaction,
  utils,
} from "ethers";

import { RFQ_EXPIRY_BUFFER_MS } from "../../constants/configParams";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { AppError } from "../../errors/appError";
import {
  SwapError,
  transformSwapErrorToAppError,
} from "../../errors/swapError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";

const REQUEST_ORDER_TIMEOUT_MS = 5000;

const erc20Interface = new ethers.utils.Interface(erc20Abi);

const WETHInterface = new utils.Interface(JSON.stringify(WETHContract.abi));

async function swap(
  chainId: number,
  provider: ethers.providers.Web3Provider,
  order: OrderERC20 | FullOrderERC20
) {
  if ("senderWallet" in order && order.senderWallet === nativeCurrencyAddress) {
    return await new SwapERC20(chainId, provider).swapAnySender(
      order,
      provider.getSigner()
    );
  }
  return await new SwapERC20(chainId, provider).swap(
    order,
    provider.getSigner()
  );
}

async function swapWrapper(
  chainId: number,
  provider: ethers.providers.Web3Provider,
  order: OrderERC20
) {
  return await new Wrapper(chainId, provider).swap(order, provider.getSigner());
}

export async function requestOrders(
  makers: Maker[],
  quoteToken: string,
  baseToken: string,
  baseTokenAmount: string,
  baseTokenDecimals: number,
  senderWallet: string
): Promise<OrderERC20[]> {
  if (!makers.length) {
    throw new Error("no counterparties");
  }
  const rfqOrderPromises = makers.map(async (server) => {
    const order = await Promise.race([
      server.getSignerSideOrder(
        toAtomicString(baseTokenAmount, baseTokenDecimals),
        quoteToken,
        baseToken,
        senderWallet
      ),
      // Makers should respond in a timely manner for orders to be considered
      new Promise((resolve, reject) =>
        setTimeout(() => {
          reject("ETIMEDOUT");
        }, REQUEST_ORDER_TIMEOUT_MS)
      ),
    ]);
    return order as any as OrderERC20;
  });
  const rfqOrders = await Promise.allSettled(rfqOrderPromises);
  return rfqOrders
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<OrderERC20>).value)
    .filter((o) => BigNumber.from(o.signerAmount).gt("0"));
}

export async function approveToken(
  baseToken: string,
  provider: ethers.providers.Web3Provider,
  contractType: "Swap" | "Wrapper"
) {
  const spender =
    contractType === "Swap"
      ? SwapERC20.getAddress(provider.network.chainId)
      : Wrapper.getAddress(provider.network.chainId);
  const erc20Contract = new ethers.Contract(
    baseToken,
    erc20Interface,
    // @ts-ignore
    provider.getSigner()
  );
  const approvalTxHash = await erc20Contract.approve(
    spender,
    constants.MaxUint256
  );
  return approvalTxHash as any as Transaction;
}

export async function takeOrder(
  order: OrderERC20 | FullOrderERC20,
  provider: ethers.providers.Web3Provider,
  contractType: "Swap" | "Wrapper"
): Promise<Transaction | AppError> {
  return new Promise<Transaction | AppError>(async (resolve) => {
    try {
      const tx: Transaction =
        contractType === "Swap"
          ? await swap(provider.network.chainId, provider, order)
          : await swapWrapper(provider.network.chainId, provider, order);
      resolve(tx);
    } catch (error: any) {
      resolve(transformUnknownErrorToAppError(error));
    }
  });
}

export function orderSortingFunction(a: OrderERC20, b: OrderERC20) {
  const now = Date.now();
  const aTimeToExpiry = now - parseInt(a.expiry);
  const bTimeToExpiry = now - parseInt(b.expiry);

  // If any of the orders come in with an expiry that is less than our required
  // buffer, put them to the bottom of the list.
  if (
    aTimeToExpiry < RFQ_EXPIRY_BUFFER_MS &&
    bTimeToExpiry >= RFQ_EXPIRY_BUFFER_MS
  ) {
    return 1; // prefer B
  } else if (
    bTimeToExpiry < RFQ_EXPIRY_BUFFER_MS &&
    aTimeToExpiry >= RFQ_EXPIRY_BUFFER_MS
  ) {
    return -1; // prefer A
  }
  // If tokens transferred are the same
  if (a.signerAmount === b.signerAmount && a.senderAmount === b.senderAmount) {
    return parseInt(b.expiry) - parseInt(a.expiry);
  }
  if (a.signerAmount === b.signerAmount) {
    // Likely senderSide
    // Sort orders by amount of senderToken sent (ascending).
    const aAmount = BigNumber.from(a.senderAmount);
    const bAmount = BigNumber.from(b.senderAmount);
    if (bAmount.lt(aAmount)) return 1;
    else return -1;
  } else {
    // Likely signerSide
    // Sort orders by amount of signerToken received (descending).
    const aAmount = BigNumber.from(a.signerAmount);
    const bAmount = BigNumber.from(b.signerAmount);
    if (bAmount.gt(aAmount)) return 1;
    else return -1;
  }
}

export async function depositETH(
  chainId: number,
  senderAmount: string,
  senderTokenDecimals: number,
  provider: ethers.providers.Web3Provider
) {
  const WETHContract = new Contract(
    wrappedTokenAddresses[chainId],
    WETHInterface,
    provider as providers.Provider
  );
  const signer = WETHContract.connect(provider.getSigner() as ethers.Signer);
  const tx = await signer.deposit({
    value: toAtomicString(senderAmount, senderTokenDecimals),
  });
  return tx as any as Transaction;
}

export async function withdrawETH(
  chainId: number,
  senderAmount: string,
  senderTokenDecimals: number,
  provider: ethers.providers.Web3Provider
) {
  const WETHContract = new Contract(
    wrappedTokenAddresses[chainId],
    WETHInterface,
    // @ts-ignore
    provider
  );
  // @ts-ignore
  const signer = WETHContract.connect(provider.getSigner());
  const tx = await signer.withdraw(
    toAtomicString(senderAmount, senderTokenDecimals)
  );
  return tx as any as Transaction;
}

export async function check(
  order: OrderERC20,
  senderWallet: string,
  chainId: number,
  signer?: ethers.providers.JsonRpcSigner
): Promise<AppError[]> {
  const errors = (await new SwapERC20(chainId, signer).check(
    order,
    senderWallet,
    signer
  )) as SwapError[];

  if (errors.length) {
    console.error(errors);
  }

  return errors.map((error) => transformSwapErrorToAppError(error));
}

export async function getNonceUsed(
  order: FullOrderERC20,
  provider: ethers.providers.Web3Provider
): Promise<boolean> {
  return new SwapERC20(order.chainId, provider).contract.nonceUsed(
    order.signerWallet,
    order.nonce
  );
}
