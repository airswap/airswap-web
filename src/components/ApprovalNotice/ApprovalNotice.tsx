import { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenKinds } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";

import { useAppDispatch } from "../../app/hooks";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  getTokenKind,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { approve } from "../../features/orders/ordersActions";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import useAllowance, { AllowancesType } from "../../hooks/useAllowance";
import { CompactActionButton } from "../../styled-components/CompactActionButton/CompactActionButton";
import { Notice } from "../Notice/Notice";
import { ButtonsContainer } from "./ApprovalNotice.styles";
import { useTotalTokenAllowanceFromOrders } from "./hooks/useTotalTokenAllowanceFromOrders";

type ApprovalNoticeProps = {
  amount: string;
  chainId?: number;
  spenderAddressType: AllowancesType;
  tokenInfo: AppTokenInfo | null;
  className?: string;
};

export const ApprovalNotice: FC<ApprovalNoticeProps> = ({
  amount,
  chainId,
  spenderAddressType,
  tokenInfo,
  className,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { provider: library } = useWeb3React();

  const [totalTokenAllowance] = useTotalTokenAllowanceFromOrders(
    spenderAddressType,
    tokenInfo,
    chainId
  );

  const tokenDecimals = tokenInfo ? getTokenDecimals(tokenInfo) : 0;
  const tokenAmount =
    tokenInfo && amount && tokenDecimals
      ? toRoundedAtomicString(amount, tokenDecimals)
      : "0";
  const totalNeededAllowance = new BigNumber(totalTokenAllowance || "0")
    .plus(tokenAmount)
    .toString();
  const formattedTotalNeededAllowance = formatUnits(
    totalNeededAllowance,
    tokenDecimals
  );

  const { hasSufficientAllowance } = useAllowance(
    tokenInfo,
    formattedTotalNeededAllowance,
    { spenderAddressType }
  );

  const handleEditButtonClick = () => {
    if (!tokenInfo) {
      console.error("Approval tokenInfo is undefined");
      return;
    }

    if (!library) {
      console.error("library is undefined");
      return;
    }

    if (!spenderAddressType) {
      console.error("spenderAddressType is undefined");
      return;
    }

    // TODO: clean this up
    const contract =
      spenderAddressType === "delegate"
        ? "Delegate"
        : spenderAddressType === "swapERC20"
        ? "SwapERC20"
        : "Swap";

    dispatch(
      approve(formattedTotalNeededAllowance, tokenInfo, library, contract)
    );
  };

  const handleDismissButtonClick = () => {
    console.log("dismiss");
  };

  if (!amount || amount === "0" || !tokenInfo || hasSufficientAllowance) {
    return null;
  }

  const isNFT = getTokenKind(tokenInfo) !== TokenKinds.ERC20;

  return (
    <Notice
      className={className}
      text={
        <>
          {isNFT
            ? t("orders.approvalExtraAmountWarningNFT")
            : t("orders.approvalExtraAmountWarningERC20")}
          <ButtonsContainer>
            {!isNFT && (
              <CompactActionButton onClick={handleEditButtonClick}>
                {t("orders.approve")}
              </CompactActionButton>
            )}
            <CompactActionButton onClick={handleDismissButtonClick}>
              {t("orders.dismiss")}
            </CompactActionButton>
          </ButtonsContainer>
        </>
      }
    />
  );
};
