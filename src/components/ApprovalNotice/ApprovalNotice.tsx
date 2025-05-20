import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO, FullOrder, FullOrderERC20 } from "@airswap/utils";

import { BigNumber } from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";

import { useAppSelector } from "../../app/hooks";
import { MyOrder } from "../../components/@widgets/MyOrdersWidget/entities/MyOrder";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  getTokenId,
  isTokenInfo,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { selectDelegateRulesReducer } from "../../features/delegateRules/delegateRulesSlice";
import { selectMyOtcOrdersReducer } from "../../features/myOtcOrders/myOtcOrdersSlice";
import { compareAddresses } from "../../helpers/string";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import useAllowance, { AllowancesType } from "../../hooks/useAllowance";
import { CompactActionButton } from "../../styled-components/CompactActionButton/CompactActionButton";
import { Notice } from "../Notice/Notice";
import { ButtonsContainer } from "./ApprovalNotice.styles";

type ApprovalNoticeProps = {
  amount: string;
  spenderAddressType: AllowancesType;
  tokenInfo: AppTokenInfo | null;
  className?: string;
};

export const ApprovalNotice: FC<ApprovalNoticeProps> = ({
  amount,
  spenderAddressType,
  tokenInfo,
  className,
}) => {
  const { t } = useTranslation();
  const allowances = useAppSelector((state) => state.allowances);
  const { userOrders } = useAppSelector(selectMyOtcOrdersReducer);
  const { delegateRules } = useAppSelector((state) => state.delegateRules);
  const orders = (
    spenderAddressType === "delegate" ? delegateRules : userOrders
  ) as (FullOrder | FullOrderERC20 | DelegateRule)[];

  console.log(orders);
  const tokenOrders = orders.filter((order) => {
    const token = isFullOrder(order) ? order.signer.token : order.signerToken;
    // filter by swapContract, expiry, taken and then add all the amounts together
    return tokenInfo ? compareAddresses(token, tokenInfo?.address) : false;
  });
  console.log(tokenOrders);

  const tokenId = tokenInfo ? getTokenId(tokenInfo) : ADDRESS_ZERO;
  const allowanceAmount = tokenId
    ? allowances[spenderAddressType].values[tokenId] || "0"
    : "0";
  const tokenDecimals = tokenInfo ? getTokenDecimals(tokenInfo) : 0;
  const tokenAmount =
    tokenInfo && amount && tokenDecimals
      ? toRoundedAtomicString(amount, tokenDecimals)
      : "0";
  const totalAmount = new BigNumber(allowanceAmount)
    .plus(tokenAmount)
    .toString();
  const formattedTotalAmount = formatUnits(totalAmount, tokenDecimals);

  const { hasSufficientAllowance } = useAllowance(
    tokenInfo,
    formattedTotalAmount,
    { spenderAddressType }
  );

  if (hasSufficientAllowance) {
    return null;
  }

  return (
    <Notice
      className={className}
      text={
        <>
          {t("orders.approvalExtraAmountWarning")}
          <ButtonsContainer>
            <CompactActionButton>Approve</CompactActionButton>
            <CompactActionButton>Cancel</CompactActionButton>
          </ButtonsContainer>
        </>
      }
    />
  );
};
