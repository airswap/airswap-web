import { FC } from "react";
import { useTranslation } from "react-i18next";

import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  OverlayContainer,
  OverlaySubHeading,
  OverlayTitle,
  OverlayTransactionLink,
} from "../../styled-components/Overlay/Overlay";
import { TransactionStatusType } from "../../types/transactionTypes";
import OverlayLoader from "../OverlayLoader/OverlayLoader";
import {
  ButtonsContainer,
  MakeNewLimitOrderButton,
  ShowLimitOrderButton,
} from "./SetRuleSubmittedSceen.styles";

interface OrderSubmittedInfoProps {
  chainId?: number;
  transaction?: SubmittedTransaction;
  onMakeNewLimitOrderButtonClick: () => void;
  onShowLimitOrderButtonClick?: () => void;
  className?: string;
}

const SetRuleSubmittedScreen: FC<OrderSubmittedInfoProps> = ({
  chainId,
  transaction,
  onMakeNewLimitOrderButtonClick: onMakeNewOrderButtonClick,
  onShowLimitOrderButtonClick,
  className = "",
}) => {
  const { t } = useTranslation();

  const isSucceeded = transaction?.status === TransactionStatusType.succeeded;

  return (
    <OverlayContainer className={className}>
      <OverlayLoader isSucceeded={isSucceeded} />
      {transaction?.status === TransactionStatusType.processing && (
        <>
          <OverlayTitle type="h2">
            {t("orders.setLimitOrderProcessing")}
          </OverlayTitle>
          <OverlaySubHeading>
            {transaction.hash && chainId && (
              <OverlayTransactionLink
                chainId={chainId}
                hash={transaction.hash}
              />
            )}
          </OverlaySubHeading>
        </>
      )}

      {isSucceeded && (
        <OverlayTitle type="h2">
          {t("orders.setLimitOrderComplete")}
        </OverlayTitle>
      )}

      {isSucceeded && (
        <ButtonsContainer>
          <MakeNewLimitOrderButton
            intent="primary"
            onClick={onMakeNewOrderButtonClick}
          >
            {t("orders.makeNewLimitOrder")}
          </MakeNewLimitOrderButton>

          <ShowLimitOrderButton
            intent="neutral"
            onClick={onShowLimitOrderButtonClick}
          >
            {t("orders.showLimitOrder")}
          </ShowLimitOrderButton>
        </ButtonsContainer>
      )}
    </OverlayContainer>
  );
};

export default SetRuleSubmittedScreen;
