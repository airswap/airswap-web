import { FC } from "react";
import { useTranslation } from "react-i18next";

import { OrderStatus } from "../../../../../types/orderStatus";
import {
  Container,
  LiveIndicator,
  LiveIndicatorLight,
  Recipient,
  StyledOrderStatusInfo,
} from "./LimitOrderStatusBar.styles";

interface LimitOrderStatusBarProps {
  isLoading?: boolean;
  expiry: Date;
  link?: string;
  status: OrderStatus;
  className?: string;
}

export const LimitOrderStatusBar: FC<LimitOrderStatusBarProps> = ({
  isLoading = false,
  expiry,
  link,
  status,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      {status === OrderStatus.open && (
        <>
          <LiveIndicator>
            <LiveIndicatorLight />
            Live
          </LiveIndicator>
          -
        </>
      )}

      <Recipient>
        {`${t("common.for")}:`} {t("orders.anyone")}
      </Recipient>

      <StyledOrderStatusInfo
        isLoading={isLoading}
        expiry={expiry}
        link={link}
        status={status}
      />
    </Container>
  );
};
