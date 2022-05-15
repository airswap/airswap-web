import { RPCError, RPCErrorWithCode } from "../constants/errors";
import getErrorCodesFromError from "./getErrorCodesFromError";

describe("getErrorCodesFromError", () => {
  it("should return the SwapErrors from an RPCError error", () => {
    const error: RPCError = {
      jsonrpc: "2.0",
      id: 2,
      error:
        'cannot estimate gas; transaction may fail or may require manual gas limit (error={"reason":"cannot estimate gas; transaction may fail or may require manual gas limit","code":"UNPREDICTABLE_GAS_LIMIT","error":{"reason":"processing response error","code":"SERVER_ERROR","body":"{\\"jsonrpc\\":\\"2.0\\",\\"id\\":78,\\"error\\":{\\"code\\":3,\\"data\\":\\"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c554e415554484f52495a45440000000000000000000000000000000000000000\\",\\"message\\":\\"execution reverted: UNAUTHORIZED\\"}}","error":{"code":3,"data":"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c554e415554484f52495a45440000000000000000000000000000000000000000"},"requestBody":"{\\"method\\":\\"eth_estimateGas\\",\\"params\\":[{\\"type\\":\\"0x2\\",\\"maxFeePerGas\\":\\"0x4a817c800\\",\\"maxPriorityFeePerGas\\":\\"0x4a817c800\\",\\"from\\":\\"0x19a6213efa6a043fc96da798ab09ee04ee0b6fa4\\",\\"to\\":\\"0xf00b40b7b3787e787e158ecd22e7eb5ddc02f985\\",\\"data\\":\\"0x011bc71800000000000000000000000000000000000000000000000000000180c806f50300000000000000000000000000000000000000000000000000000000628108640000000000000000000000002de63f2d35943aa17aa835ea69fd3f768b9f63370000000000000000000000005592ec0cfb4dbc12d3ab100b257153436a1f0fea00000000000000000000000000000000000000000000000000238095c31953f0000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000000000000000000000000000001ff3fecf1c2000000000000000000000000000000000000000000000000000000000000000001b4a020e584c4617ae6f450c5ca9f22695860075312ce674b334b29679265993664adfe60c2ae856a57fe0c6058bbb23e705f6ad5dbfa33ed5d6921dd0e9b91f59\\"}],\\"id\\":78,\\"jsonrpc\\":\\"2.0\\"}","requestMethod":"POST","url":"https://rinkeby.infura.io/v3/cffcbe59ff6449a9b8fb543941b65202"},"method":"estimateGas","transaction":{"from":"0x19a6213EFA6A043fc96dA798Ab09Ee04eE0b6Fa4","maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x04a817c800"},"maxFeePerGas":{"type":"BigNumber","hex":"0x04a817c800"},"to":"0xf00b40B7b3787e787E158ecD22E7eb5ddC02f985","data":"0x011bc71800000000000000000000000000000000000000000000000000000180c806f50300000000000000000000000000000000000000000000000000000000628108640000000000000000000000002de63f2d35943aa17aa835ea69fd3f768b9f63370000000000000000000000005592ec0cfb4dbc12d3ab100b257153436a1f0fea00000000000000000000000000000000000000000000000000238095c31953f0000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000000000000000000000000000001ff3fecf1c2000000000000000000000000000000000000000000000000000000000000000001b4a020e584c4617ae6f450c5ca9f22695860075312ce674b334b29679265993664adfe60c2ae856a57fe0c6058bbb23e705f6ad5dbfa33ed5d6921dd0e9b91f59","type":2,"accessList":null}}, tx={"data":"0x011bc71800000000000000000000000000000000000000000000000000000180c806f50300000000000000000000000000000000000000000000000000000000628108640000000000000000000000002de63f2d35943aa17aa835ea69fd3f768b9f63370000000000000000000000005592ec0cfb4dbc12d3ab100b257153436a1f0fea00000000000000000000000000000000000000000000000000238095c31953f0000000000000000000000000c778417e063141139fce010982780140aa0cd5ab000000000000000000000000000000000000000000000000001ff3fecf1c2000000000000000000000000000000000000000000000000000000000000000001b4a020e584c4617ae6f450c5ca9f22695860075312ce674b334b29679265993664adfe60c2ae856a57fe0c6058bbb23e705f6ad5dbfa33ed5d6921dd0e9b91f59","to":{},"from":"0x19a6213EFA6A043fc96dA798Ab09Ee04eE0b6Fa4","type":2,"maxFeePerGas":{"type":"BigNumber","hex":"0x04a817c800"},"maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x04a817c800"},"nonce":{},"gasLimit":{},"chainId":{}}, code=UNPREDICTABLE_GAS_LIMIT, version=abstract-signer/5.4.1)',
    };

    const result = getErrorCodesFromError(error);

    expect(result).toStrictEqual(["UNAUTHORIZED", "UNPREDICTABLE_GAS_LIMIT"]);
  });

  it("should return error code from an RPCErrorWithCode error", () => {
    const error: RPCErrorWithCode = {
      code: 2,
      message: "",
      stack: "",
    };

    const result = getErrorCodesFromError(error);

    expect(result).toStrictEqual([2]);
  });
});
