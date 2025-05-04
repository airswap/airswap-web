import { ethers } from "ethers";

import { AppTokenInfo } from "../../../../../../entities/AppTokenInfo/AppTokenInfo";
import { DelegateRule } from "../../../../../../entities/DelegateRule/DelegateRule";
import { routes } from "../../../../../../routes";
import { OrderStatus } from "../../../../../../types/orderStatus";
import { MyOrder } from "../../../../MyOrdersWidget/entities/MyOrder";
import { findTokenInfo } from "../../../../MyOtcOrdersWidget/subcomponents/MyOtcOrdersList/helpers";

const getOrderStatus = (delegateRule: DelegateRule): OrderStatus => {
  if (delegateRule.senderFilledAmount === delegateRule.senderAmount) {
    return OrderStatus.filled;
  }

  if (new Date().getTime() > delegateRule.expiry * 1000) {
    return OrderStatus.expired;
  }

  return OrderStatus.open;
};

export const getDelegateRuleDataAndTransformToMyOrder = async (
  delegateRule: DelegateRule,
  activeTokens: AppTokenInfo[],
  provider: ethers.providers.BaseProvider
): Promise<MyOrder> => {
  const link = routes.limitOrder(
    delegateRule.senderWallet,
    delegateRule.senderToken,
    delegateRule.signerToken,
    delegateRule.chainId
  );

  const status = getOrderStatus(delegateRule);

  const signerToken = await findTokenInfo(
    delegateRule.signerToken,
    activeTokens,
    provider
  );
  const senderToken = await findTokenInfo(
    delegateRule.senderToken,
    activeTokens,
    provider
  );

  return {
    id: delegateRule.id,
    status,
    senderToken: senderToken,
    signerToken: signerToken,
    senderFilledAmount: delegateRule.senderFilledAmount,
    chainId: delegateRule.chainId,
    senderAmount: delegateRule.senderAmount,
    signerAmount: delegateRule.signerAmount,
    expiry: new Date(delegateRule.expiry * 1000),
    link,
  };
};
