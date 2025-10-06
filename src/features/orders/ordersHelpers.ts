import {
  Server,
  Wrapper,
  WETH,
  Delegate,
  Swap,
  SwapERC20,
} from "@airswap/libraries";
import {
  toAtomicString,
  parseCheckResult,
  orderERC20ToParams,
  FullOrderERC20,
  OrderERC20,
  ADDRESS_ZERO,
  FullOrder,
  TokenKinds,
  fullOrderToParams,
} from "@airswap/utils";
import erc20Contract from "@openzeppelin/contracts/build/contracts/ERC20.json";
import erc721Contract from "@openzeppelin/contracts/build/contracts/ERC721.json";
import erc1155Contract from "@openzeppelin/contracts/build/contracts/ERC1155.json";

import { BigNumber, ethers, Transaction } from "ethers";

import { RFQ_EXPIRY_BUFFER_MS } from "../../constants/configParams";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { getFullOrderNonceUsed } from "../../entities/FullOrder/FullOrderService";
import { getOrderErc20NonceUsed } from "../../entities/OrderERC20/OrderERC20Service";
import { AppError } from "../../errors/appError";
import {
  SwapError,
  transformSwapErrorToAppError,
} from "../../errors/swapError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import { checkSwapOrder, getSwapContract } from "../../helpers/swap";
import {
  checkSwapErc20Order,
  getSwapErc20Address,
  getSwapErc20Contract,
} from "../../helpers/swapErc20";

const REQUEST_ORDER_TIMEOUT_MS = 5000;

const erc20Interface = new ethers.utils.Interface(erc20Contract.abi);
const erc721Interface = new ethers.utils.Interface(erc721Contract.abi);
const erc1155Interface = new ethers.utils.Interface(erc1155Contract.abi);

async function swapOrderErc20(
  chainId: number,
  provider: ethers.providers.Web3Provider,
  order: OrderERC20 | FullOrderERC20
) {
  const contract = await getSwapErc20Contract(provider.getSigner(), chainId);
  if ("senderWallet" in order && order.senderWallet === ADDRESS_ZERO) {
    return contract.swapAnySender(
      await (await provider.getSigner()).getAddress(),
      ...orderERC20ToParams(order)
    );
  }
  return contract.swap(
    await (await provider.getSigner()).getAddress(),
    ...orderERC20ToParams(order)
  );
}

async function swapFullOrder(
  chainId: number,
  provider: ethers.providers.Web3Provider,
  order: FullOrder
) {
  const contract = await getSwapContract(provider, chainId);
  if (order.sender.wallet === ADDRESS_ZERO) {
    return contract.swapAnySender(
      await (await provider.getSigner()).getAddress(),
      ...fullOrderToParams(order)
    );
  }
  return contract.swap(
    await (await provider.getSigner()).getAddress(),
    ...fullOrderToParams(order)
  );
}

async function swapWrapper(
  chainId: number,
  provider: ethers.providers.Web3Provider,
  order: OrderERC20
) {
  return (await Wrapper.getContract(provider.getSigner(), chainId)).swap(
    ...orderERC20ToParams(order),
    { value: order.senderAmount }
  );
}

export async function requestOrders(
  servers: Server[],
  quoteToken: string,
  baseToken: string,
  baseTokenAmount: string,
  baseTokenDecimals: number,
  senderWallet: string,
  proxyingFor?: string
): Promise<OrderERC20[]> {
  if (!servers.length) {
    throw new Error("no counterparties");
  }
  const rfqOrderPromises = servers.map(async (server) => {
    const order = await Promise.race([
      server.getSignerSideOrderERC20(
        toAtomicString(baseTokenAmount, baseTokenDecimals),
        quoteToken,
        baseToken,
        senderWallet,
        proxyingFor
      ),
      // servers should respond in a timely manner for orders to be considered
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

const getSpenderAddress = (
  contractType: "Swap" | "SwapERC20" | "Wrapper" | "Delegate",
  provider: ethers.providers.Web3Provider
) => {
  if (contractType === "Swap") {
    return Swap.getAddress(provider.network.chainId);
  }

  if (contractType === "SwapERC20") {
    return SwapERC20.getAddress(provider.network.chainId);
  }

  if (contractType === "Delegate") {
    return Delegate.getAddress(provider.network.chainId);
  }

  return Wrapper.getAddress(provider.network.chainId);
};

export async function approveErc20Token(
  baseToken: string,
  provider: ethers.providers.Web3Provider,
  contractType: "Swap" | "SwapERC20" | "Wrapper" | "Delegate",
  amount: string | number
): Promise<Transaction | AppError> {
  return new Promise<Transaction | AppError>((resolve) => {
    const spender = getSpenderAddress(contractType, provider);
    const erc20Contract = new ethers.Contract(
      baseToken,
      erc20Interface,
      provider.getSigner()
    );
    erc20Contract
      .approve(spender, amount)
      .then(resolve)
      .catch((error: any) => {
        resolve(transformUnknownErrorToAppError(error));
      });
  });
}

export async function approveNftToken(
  baseToken: string,
  provider: ethers.providers.Web3Provider,
  contractType: "Swap" | "SwapERC20" | "Wrapper" | "Delegate",
  tokenKind: TokenKinds,
  tokenId: string,
  amount: string | number
): Promise<Transaction | AppError> {
  return new Promise<Transaction | AppError>((resolve) => {
    const contractAddress =
      +amount === 0 ? ADDRESS_ZERO : getSpenderAddress(contractType, provider);
    const contract = new ethers.Contract(
      baseToken,
      tokenKind === TokenKinds.ERC1155 ? erc1155Interface : erc721Interface,
      provider.getSigner()
    );

    const method =
      tokenKind === TokenKinds.ERC721
        ? contract.approve(contractAddress, tokenId)
        : contract.setApprovalForAll(contractAddress, true);

    return method.then(resolve).catch((error: any) => {
      resolve(transformUnknownErrorToAppError(error));
    });
  });
}

export async function takeErc20Order(
  order: OrderERC20 | FullOrderERC20,
  provider: ethers.providers.Web3Provider,
  contractType: "SwapERC20" | "Wrapper"
): Promise<Transaction | AppError> {
  return new Promise<Transaction | AppError>((resolve) => {
    if (contractType === "SwapERC20") {
      swapOrderErc20(provider.network.chainId, provider, order)
        .then(resolve)
        .catch((error: any) => {
          resolve(transformUnknownErrorToAppError(error));
        });
    } else {
      swapWrapper(provider.network.chainId, provider, order)
        .then(resolve)
        .catch((error: any) => {
          resolve(transformUnknownErrorToAppError(error));
        });
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
  const signer = WETH.getContract(provider.getSigner(), chainId);
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
  const signer = WETH.getContract(provider.getSigner(), chainId);
  const tx = await signer.withdraw(
    toAtomicString(senderAmount, senderTokenDecimals)
  );
  return tx as any as Transaction;
}

export async function checkOrderErc20(
  order: OrderERC20,
  senderWallet: string,
  chainId: number,
  provider: ethers.providers.Web3Provider,
  isSwapWithWrap?: boolean
): Promise<AppError[]> {
  const strings = await checkSwapErc20Order(
    provider,
    chainId,
    senderWallet,
    order
  );

  const errors = parseCheckResult(strings) as SwapError[];

  // If swapping with wrapper then ignore sender errors.
  const filteredErrors = isSwapWithWrap
    ? errors.filter((error) => {
        return !(
          error === "SenderAllowanceLow" || error === "SenderBalanceLow"
        );
      })
    : errors;

  if (filteredErrors.length) {
    console.error("check returned errors", filteredErrors);
  }

  return filteredErrors.map((error) => transformSwapErrorToAppError(error));
}

export async function getNonceUsed(
  order: FullOrder | FullOrderERC20,
  provider: ethers.providers.BaseProvider
): Promise<boolean> {
  if (isFullOrder(order)) {
    return getFullOrderNonceUsed(order, provider);
  }

  return getOrderErc20NonceUsed(order, provider);
}
