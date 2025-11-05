import { FC, PropsWithChildren, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO } from "@airswap/utils";

import {
  getTokenDecimals,
  getTokenImage,
  getTokenSymbol,
} from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { getExpiryTranslation } from "../../../../../helpers/getExpiryTranslation";
import { getHumanReadableNumber } from "../../../../../helpers/getHumanReadableNumber";
import { OrderStatus } from "../../../../../types/orderStatus";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import { MyOrder as MyOrderInterface } from "../../../MyOrdersWidget/entities/MyOrder";
import {
  getOrderStatusTranslation,
  getTokenAmountWithDecimals,
} from "../../../MyOrdersWidget/helpers";
import useFormattedTokenAmount from "../../../OrderDetailWidget/hooks/useFormattedTokenAmount";
import {
  ActionButton,
  ActionButtonContainer,
  AmountContainer,
  Circle,
  Container,
  Divider,
  FilledAmount,
  MetaItemContainer,
  MetaItems,
  OrderStatusAndIndicator,
  OrderStatusLabel,
  SenderAmount,
  SignerAmount,
  StatusIndicator,
  StyledNavLink,
  StyledTooltip,
  Text,
  TokenAndAmount,
  TokenIcon,
  Tokens,
  TokensAndAmountContainer,
  MetaLabel,
  Warning,
} from "./Order.styles";

interface OrderProps {
  hasFilledColumn?: boolean;
  hasForColumn?: boolean;
  isCancelInProgress: boolean;
  order: MyOrderInterface;
  index: number;
  onDeleteOrderButtonClick: (order: MyOrderInterface) => void;
  onDeleteOrderButtonMouseEnter: (index: number, orderIsOpen: boolean) => void;
  onDeleteOrderButtonMouseLeave: () => void;
  onStatusIndicatorMouseEnter: (index: number, status: OrderStatus) => void;
  onStatusIndicatorMouseLeave: () => void;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  hasFilledColumn,
  hasForColumn,
  isCancelInProgress,
  order,
  index,
  onDeleteOrderButtonClick,
  onDeleteOrderButtonMouseEnter,
  onDeleteOrderButtonMouseLeave,
  onStatusIndicatorMouseEnter,
  onStatusIndicatorMouseLeave,
  className,
}) => {
  const { t } = useTranslation();
  const [isHoveredActionButton, setIsHoveredActionButton] = useState(false);
  const [hasEnteredElement, setHasEnteredElement] = useState(false);

  const senderTokenDecimals = order.senderToken
    ? getTokenDecimals(order.senderToken)
    : undefined;
  const signerTokenDecimals = order.signerToken
    ? getTokenDecimals(order.signerToken)
    : undefined;
  const senderTokenSymbol = order.senderToken
    ? getTokenSymbol(order.senderToken)
    : undefined;
  const signerTokenSymbol = order.signerToken
    ? getTokenSymbol(order.signerToken)
    : undefined;
  const senderTokenImage = order.senderToken
    ? getTokenImage(order.senderToken)
    : undefined;
  const signerTokenImage = order.signerToken
    ? getTokenImage(order.signerToken)
    : undefined;

  const senderAmount = useMemo(
    () =>
      order.senderToken
        ? getHumanReadableNumber(
            getTokenAmountWithDecimals(
              order.senderAmount,
              senderTokenDecimals
            ).toString()
          )
        : "",
    [order]
  );

  const signerAmount = useMemo(
    () =>
      order.signerToken
        ? getHumanReadableNumber(
            getTokenAmountWithDecimals(
              order.signerAmount,
              signerTokenDecimals
            ).toString()
          )
        : "",
    [order]
  );

  const timeLeft = useMemo(() => {
    return getExpiryTranslation(new Date(), order.expiry);
  }, [order]);

  const orderStatusTranslation = useMemo(
    () => getOrderStatusTranslation(order.status),
    [order.status]
  );

  const filledAmount = useFormattedTokenAmount(
    order.senderFilledAmount,
    senderTokenDecimals
  );

  const handleDeleteOrderButtonClick = () => {
    onDeleteOrderButtonClick(order);
    setIsHoveredActionButton(false);
  };

  const handleActionButtonMouseEnter = () => {
    setIsHoveredActionButton(true);
    onDeleteOrderButtonMouseEnter(index, order.status === OrderStatus.open);
  };

  const handleActionButtonMouseLeave = () => {
    setIsHoveredActionButton(false);
    onDeleteOrderButtonMouseLeave();
  };

  return (
    <Container
      orderStatus={order.status}
      className={className}
      onMouseEnter={() => setHasEnteredElement(true)}
      onMouseLeave={() => setHasEnteredElement(false)}
    >
      {order.hasAllowanceWarning && (
        <>
          <Warning />
          <StyledTooltip>{t("orders.allowanceWarning")}</StyledTooltip>
        </>
      )}
      <TokensAndAmountContainer>
        <TokenAndAmount>
          <TokenIcon logoURI={signerTokenImage} />

          <AmountContainer>
            <Text>{t("orders.from")}</Text>
            <SignerAmount>
              {`${signerAmount} ${signerTokenSymbol || ""}`}
            </SignerAmount>
          </AmountContainer>
        </TokenAndAmount>

        <TokenAndAmount>
          <TokenIcon logoURI={senderTokenImage} />

          <AmountContainer>
            <Text>{t("orders.to")}</Text>
            <SenderAmount>
              {`${senderAmount} ${senderTokenSymbol || ""}`}
            </SenderAmount>
          </AmountContainer>
        </TokenAndAmount>
      </TokensAndAmountContainer>

      <Divider />

      <MetaItems>
        <MetaItemContainer>
          <MetaLabel>{t("common.status")}</MetaLabel>
          <OrderStatusAndIndicator>
            <StatusIndicator
              onMouseEnter={() =>
                onStatusIndicatorMouseEnter(index, order.status)
              }
              onMouseLeave={onStatusIndicatorMouseLeave}
            >
              <Circle />
            </StatusIndicator>

            <OrderStatusLabel>
              {order.status === OrderStatus.open
                ? timeLeft
                : orderStatusTranslation}
            </OrderStatusLabel>
          </OrderStatusAndIndicator>
        </MetaItemContainer>

        <MetaItemContainer>
          <MetaLabel>{t("common.expiry")}</MetaLabel>
          <OrderStatusAndIndicator>
            <FilledAmount>
              {order.for === ADDRESS_ZERO ? t("orders.anyone") : order.for}
            </FilledAmount>
          </OrderStatusAndIndicator>
        </MetaItemContainer>
      </MetaItems>

      <StyledNavLink
        $isHovered={isHoveredActionButton}
        $hasWarning={order.hasAllowanceWarning}
        to={order.link}
      />

      <ActionButtonContainer>
        {isCancelInProgress ? (
          <LoadingSpinner />
        ) : (
          hasEnteredElement && (
            <ActionButton
              icon={order.status !== OrderStatus.open ? "bin" : "button-x"}
              iconSize={order.status === OrderStatus.open ? 0.5625 : 0.675}
              onClick={handleDeleteOrderButtonClick}
              onMouseEnter={handleActionButtonMouseEnter}
              onMouseLeave={handleActionButtonMouseLeave}
            />
          )
        )}
      </ActionButtonContainer>
    </Container>
  );
};

export default Order;
