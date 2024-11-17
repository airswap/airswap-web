import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Title } from "../../../../Typography/Typography";
import { StyledWidgetHeader } from "./OrderDetailWidgetHeader.styles";

type OrderDetailWidgetHeaderProps = {
  isMakerOfSwap: boolean;
  className?: string;
};

const OrderDetailWidgetHeader: FC<OrderDetailWidgetHeaderProps> = ({
  isMakerOfSwap,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <StyledWidgetHeader className={className}>
      <Title type="h2" as="h1">
        {isMakerOfSwap ? t("common.order") : t("orders.takeOtc")}
      </Title>
    </StyledWidgetHeader>
  );
};

export default OrderDetailWidgetHeader;
