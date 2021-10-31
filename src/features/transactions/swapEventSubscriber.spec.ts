import { mapSwapEvent, SwapRow } from "./swapEventSubscriber";
import { TransactionsState } from "./transactionsSlice";

const ethTransaction = [
  {
    _hex: "0x017cd607b033",
    _isBigNumber: true,
  },
  {
    _hex: "0x617e78e9",
    _isBigNumber: true,
  },
  "0x8e811410CE01e0244808Af95bbA906b8aB77a40b",
  "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
  {
    _hex: "0x03328b944c4000",
    _isBigNumber: true,
  },
  {
    _hex: "0x07",
    _isBigNumber: true,
  },
  "0x146060B05DE8755A1bD2aef4f604d1028cb21C1A",
  "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  {
    _hex: "0x038d7ea4c68000",
    _isBigNumber: true,
  },
  {
    blockNumber: 9561207,
    blockHash:
      "0xb8a8ff32f34459560336239a059bcb8b8e47d59df766dba777d86a290eb7ba77",
    transactionIndex: 14,
    removed: false,
    address: "0xF662df38e97D6Ee5d6B247bda646C58F73D3947e",
    data:
      "0x00000000000000000000000000000000000000000000000000000000617e78e90000000000000000000000005592ec0cfb4dbc12d3ab100b257153436a1f0fea0000000000000000000000000000000000000000000000000003328b944c40000000000000000000000000000000000000000000000000000000000000000007000000000000000000000000c778417e063141139fce010982780140aa0cd5ab00000000000000000000000000000000000000000000000000038d7ea4c68000",
    topics: [
      "0x06dfeb25e76d44e08965b639a9d9307df8e1c3dbe2a6364194895e9c3992f033",
      "0x0000000000000000000000000000000000000000000000000000017cd607b033",
      "0x0000000000000000000000008e811410ce01e0244808af95bba906b8ab77a40b",
      "0x000000000000000000000000146060b05de8755a1bd2aef4f604d1028cb21c1a",
    ],
    transactionHash:
      "0x117def6da790d4d1b64f7257d607698e5d241191a557e7319080981e79720e0c",
    logIndex: 20,
    event: "Swap",
    eventSignature:
      "Swap(uint256,uint256,address,address,uint256,uint256,address,address,uint256)",
    args: [
      {
        _hex: "0x017cd607b033",
        _isBigNumber: true,
      },
      {
        _hex: "0x617e78e9",
        _isBigNumber: true,
      },
      "0x8e811410CE01e0244808Af95bbA906b8aB77a40b",
      "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
      {
        _hex: "0x03328b944c4000",
        _isBigNumber: true,
      },
      {
        _hex: "0x07",
        _isBigNumber: true,
      },
      "0x146060B05DE8755A1bD2aef4f604d1028cb21C1A",
      "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      {
        _hex: "0x038d7ea4c68000",
        _isBigNumber: true,
      },
    ],
  },
];
const llTransaction = [
  {
    _hex: "0x017cd6d38689",
    _isBigNumber: true,
  },
  {
    _hex: "0x617ead05",
    _isBigNumber: true,
  },
  "0x63006013aaB710Ca21F1404f71d37111d7F928a8",
  "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  {
    _hex: "0x038d7ea4c68000",
    _isBigNumber: true,
  },
  {
    _hex: "0x07",
    _isBigNumber: true,
  },
  "0x8e811410CE01e0244808Af95bbA906b8aB77a40b",
  "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
  {
    _hex: "0x038720d4431000",
    _isBigNumber: true,
  },
  {
    blockNumber: 9562096,
    blockHash:
      "0xa5216039e80cb7e2b30e8de0bf79f67bde64cefd951d95c0b5481387fb5a850b",
    transactionIndex: 0,
    removed: false,
    address: "0xF662df38e97D6Ee5d6B247bda646C58F73D3947e",
    data:
      "0x00000000000000000000000000000000000000000000000000000000617ead05000000000000000000000000c778417e063141139fce010982780140aa0cd5ab00000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000070000000000000000000000005592ec0cfb4dbc12d3ab100b257153436a1f0fea00000000000000000000000000000000000000000000000000038720d4431000",
    topics: [
      "0x06dfeb25e76d44e08965b639a9d9307df8e1c3dbe2a6364194895e9c3992f033",
      "0x0000000000000000000000000000000000000000000000000000017cd6d38689",
      "0x00000000000000000000000063cf6013aab710ca21f1404f71d37111d7f928a8",
      "0x0000000000000000000000008e811410ce01e0244808af95bba906b8ab77a40b",
    ],
    transactionHash:
      "0x791ef6447ac3a5b1dbee1f73d23d13b2e9bf176f3e4e2199a8a44334f2dc1265",
    logIndex: 3,
    event: "Swap",
    eventSignature:
      "Swap(uint256,uint256,address,address,uint256,uint256,address,address,uint256)",
    args: [
      {
        _hex: "0x017cd6d38689",
        _isBigNumber: true,
      },
      {
        _hex: "0x617ead05",
        _isBigNumber: true,
      },
      "0x63006013aaB710Ca21F1404f71d37111d7F928a8",
      "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      {
        _hex: "0x038d7ea4c68000",
        _isBigNumber: true,
      },
      {
        _hex: "0x07",
        _isBigNumber: true,
      },
      "0x8e811410CE01e0244808Af95bbA906b8aB77a40b",
      "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
      {
        _hex: "0x038720d4431000",
        _isBigNumber: true,
      },
    ],
  },
];
const rfqTransaction = [
  {
    _hex: "0x017cd6e05d3b",
    _isBigNumber: true,
  },
  {
    _hex: "0x617eb04e",
    _isBigNumber: true,
  },
  "0x8e811410CE01e0244808Af95bbA906b8aB77a40b",
  "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  {
    _hex: "0x2bd72a24874000",
    _isBigNumber: true,
  },
  {
    _hex: "0x07",
    _isBigNumber: true,
  },
  "0x63006013aaB710Ca21F1404f71d37111d7F928a8",
  "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
  {
    _hex: "0x2bd72a24874000",
    _isBigNumber: true,
  },
  {
    blockNumber: 9562152,
    blockHash:
      "0xa11e9076f971ef2902d8be49177d86510d179f5fca4434145aaf1a4b1580b474",
    transactionIndex: 7,
    removed: false,
    address: "0xF662df38e97D6Ee5d6B247bda646C58F73D3947e",
    data:
      "0x00000000000000000000000000000000000000000000000000000000617eb04e000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000000000000000000000000000002bd72a2487400000000000000000000000000000000000000000000000000000000000000000070000000000000000000000005592ec0cfb4dbc12d3ab100b257153436a1f0fea000000000000000000000000000000000000000000000000002bd72a24874000",
    topics: [
      "0x06dfeb25e76d44e08965b639a9d9307df8e1c3dbe2a6364194895e9c3992f033",
      "0x0000000000000000000000000000000000000000000000000000017cd6e05d3b",
      "0x0000000000000000000000008e811410ce01e0244808af95bba906b8ab77a40b",
      "0x00000000000000000000000063cf6013aab710ca21f1404f71d37111d7f928a8",
    ],
    transactionHash:
      "0xbf4203e544b16df94be22ec8533db3c4dde958edf37ced677d60b9bab9c1f3f5",
    logIndex: 12,
    event: "Swap",
    eventSignature:
      "Swap(uint256,uint256,address,address,uint256,uint256,address,address,uint256)",
    args: [
      {
        _hex: "0x017cd6e05d3b",
        _isBigNumber: true,
      },
      {
        _hex: "0x617eb04e",
        _isBigNumber: true,
      },
      "0x8e811410CE01e0244808Af95bbA906b8aB77a40b",
      "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      {
        _hex: "0x2bd72a24874000",
        _isBigNumber: true,
      },
      {
        _hex: "0x07",
        _isBigNumber: true,
      },
      "0x63006013aaB710Ca21F1404f71d37111d7F928a8",
      "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
      {
        _hex: "0x2bd72a24874000",
        _isBigNumber: true,
      },
    ],
  },
];
const walletAccount = "0x63006013aaB710Ca21F1404f71d37111d7F928a8";
const transactions: TransactionsState = {
  all: [
    {
      type: "Order",
      protocol: "request-for-quote",
      hash:
        "0x117def6da790d4d1b64f7257d607698e5d241191a557e7319080981e79720e0c",
      status: "processing",
      timestamp: 1635693538866,
      nonce: "1635678400563",
      expiry: "1635693707",
    },
  ],
};
describe("handleTransaction", () => {
  it("should map eth orders to rfq", () => {
    const { nonce, signerWallet, transactionHash, protocol } = mapSwapEvent(
      ethTransaction as SwapRow[],
      4,
      walletAccount,
      transactions
    );
    expect(nonce).toEqual(1635678400563);
    expect(signerWallet).toEqual("0x146060B05DE8755A1bD2aef4f604d1028cb21C1A");
    expect(transactionHash).toEqual(
      "0x117def6da790d4d1b64f7257d607698e5d241191a557e7319080981e79720e0c"
    );
    expect(protocol).toEqual("request-for-quote");
  });
  it("should map last-look orders correctly", () => {
    const { nonce, signerWallet, transactionHash, protocol } = mapSwapEvent(
      llTransaction as SwapRow[],
      4,
      walletAccount,
      transactions
    );
    expect(nonce).toEqual(1635691759241);
    // note, this may be confusing, but the signerWallet that is received is replaced with
    // the senderWallet in order to update the store correctly
    expect(signerWallet).toEqual(walletAccount);
    expect(transactionHash).toEqual(
      "0x791ef6447ac3a5b1dbee1f73d23d13b2e9bf176f3e4e2199a8a44334f2dc1265"
    );
    expect(protocol).toEqual("last-look");
  });
  it("should map regular rfq orders correctly", () => {
    const { nonce, signerWallet, transactionHash, protocol } = mapSwapEvent(
      rfqTransaction as SwapRow[],
      4,
      walletAccount,
      transactions
    );
    expect(nonce).toEqual(1635692600635);
    expect(signerWallet).toEqual(walletAccount);
    expect(transactionHash).toEqual(
      "0xbf4203e544b16df94be22ec8533db3c4dde958edf37ced677d60b9bab9c1f3f5"
    );
    expect(protocol).toEqual("request-for-quote");
  });
});
