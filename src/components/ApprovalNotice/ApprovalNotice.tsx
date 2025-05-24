import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TokenKinds } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch } from "../../app/hooks";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenKind } from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { approve } from "../../features/orders/ordersActions";
import { AllowancesType } from "../../hooks/useAllowance";
import { CompactActionButton } from "../../styled-components/CompactActionButton/CompactActionButton";
import { Notice } from "../Notice/Notice";
import { ButtonsContainer } from "./ApprovalNotice.styles";
import { getTotalNeededAllowance } from "./helpers";
import { useTotalTokenAllowanceFromOrders } from "./hooks/useTotalTokenAllowanceFromOrders";

type ApprovalNoticeProps = {
  orderAmount?: string;
  chainId?: number;
  spenderAddressType: AllowancesType;
  tokenInfo: AppTokenInfo | null;
  className?: string;
};

export const ApprovalNotice: FC<ApprovalNoticeProps> = ({
  orderAmount,
  chainId,
  spenderAddressType,
  tokenInfo,
  className,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { provider: library } = useWeb3React();
  const { resize } = useContext(InterfaceContext);

  const [isHidden, setIsHidden] = useState(false);

  const [totalTokenAllowance] = useTotalTokenAllowanceFromOrders(
    spenderAddressType,
    tokenInfo,
    chainId
  );

  const totalNeededAllowance = getTotalNeededAllowance(
    orderAmount || "0",
    totalTokenAllowance || "0",
    tokenInfo
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

    dispatch(approve(totalNeededAllowance, tokenInfo, library, contract));
  };

  const handleDismissButtonClick = () => {
    setIsHidden(true);
  };

  useEffect(() => {
    resize();
  }, [isHidden]);

  if (!tokenInfo || isHidden) {
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
