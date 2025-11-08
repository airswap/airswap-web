import {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useMouse, useToggle } from "react-use";

import { ADDRESS_ZERO } from "@airswap/utils";

import { useClickAnyWhere } from "usehooks-ts";

import {
  getTokenDecimals,
  getTokenImage,
  getTokenSymbol,
} from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { getExpiryTranslation } from "../../../../../helpers/getExpiryTranslation";
import { getHumanReadableNumber } from "../../../../../helpers/getHumanReadableNumber";
import writeTextToClipboard from "../../../../../helpers/writeTextToClipboard";
import { OrderStatus } from "../../../../../types/orderStatus";
import Icon from "../../../../Icon/Icon";
import { MyOrder as MyOrderInterface } from "../../../MyOrdersWidget/entities/MyOrder";
import {
  getOrderStatusTranslation,
  getTokenAmountWithDecimals,
} from "../../../MyOrdersWidget/helpers";
import {
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
  TokensAndAmountContainer,
  MetaLabel,
  Warning,
  ActionMenuButton,
  ActionMenu,
  NewActionMenuButton,
  NewActionMenuButtonIcon,
  ActionButtonLoader,
} from "./Order.styles";

interface OrderProps {
  isCancelInProgress: boolean;
  order: MyOrderInterface;
  index: number;
  onDeleteOrderButtonClick: (order: MyOrderInterface) => void;
  onStatusIndicatorMouseEnter: (index: number, status: OrderStatus) => void;
  onStatusIndicatorMouseLeave: () => void;
  className?: string;
}

const Order: FC<PropsWithChildren<OrderProps>> = ({
  isCancelInProgress,
  order,
  index,
  onDeleteOrderButtonClick,
  onStatusIndicatorMouseEnter,
  onStatusIndicatorMouseLeave,
  className,
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hasEnteredElement, setHasEnteredElement] = useState(false);
  const [isActionMenuOpen, toggleIsActionMenuOpen] = useToggle(false);
  const [writeAddressToClipboardSuccess, setWriteAddressToClipboardSuccess] =
    useState(false);
  const { elX, elY, elW, elH } = useMouse(ref);

  useClickAnyWhere(() => {
    if (!hasEnteredElement) {
      toggleIsActionMenuOpen(false);
      setWriteAddressToClipboardSuccess(false);
    }
  });

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

  const handleDeleteOrderButtonClick = () => {
    onDeleteOrderButtonClick(order);
    toggleIsActionMenuOpen(false);
  };

  const handleCopyLinkButtonClick = async () => {
    const link = window.location.origin + order.link;
    const isCopySuccess = await writeTextToClipboard(link);

    if (isCopySuccess) {
      setWriteAddressToClipboardSuccess(true);
    }
  };

  useEffect(() => {
    if (elX > 0 && elY > 0 && elX < elW && elY < elH) {
      setHasEnteredElement(true);
    } else {
      setHasEnteredElement(false);
    }
  }, [elX, elY]);

  return (
    <Container
      className={className}
      orderStatus={order.status}
      $hasEnteredElement={hasEnteredElement}
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
          <TokenIcon
            $invisible={hasEnteredElement}
            logoURI={senderTokenImage}
          />

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
          <MetaLabel>{t("common.for")}</MetaLabel>
          <OrderStatusAndIndicator>
            <FilledAmount>
              {order.for === ADDRESS_ZERO ? t("orders.anyone") : order.for}
            </FilledAmount>
          </OrderStatusAndIndicator>
        </MetaItemContainer>
      </MetaItems>

      <StyledNavLink
        $isHovered={hasEnteredElement}
        $hasWarning={order.hasAllowanceWarning}
        ref={ref}
        to={order.link}
      />

      <ActionButtonContainer>
        {isCancelInProgress ? (
          <ActionButtonLoader />
        ) : (
          hasEnteredElement && (
            <ActionMenuButton
              icon="dots"
              iconSize={0.6875}
              onClick={toggleIsActionMenuOpen}
            />
          )
        )}
      </ActionButtonContainer>

      {isActionMenuOpen && (
        <ActionMenu>
          <NewActionMenuButton onClick={handleCopyLinkButtonClick}>
            <NewActionMenuButtonIcon>
              <Icon name={writeAddressToClipboardSuccess ? "check" : "copy"} />
            </NewActionMenuButtonIcon>
            Copy link
          </NewActionMenuButton>

          <NewActionMenuButton onClick={handleDeleteOrderButtonClick}>
            <NewActionMenuButtonIcon>
              <Icon
                name={order.status !== OrderStatus.open ? "bin" : "button-x"}
                iconSize={order.status === OrderStatus.open ? 0.5625 : 0.675}
              />
            </NewActionMenuButtonIcon>
            {order.status !== OrderStatus.open
              ? "Delete order"
              : "Cancel order"}
          </NewActionMenuButton>
        </ActionMenu>
      )}
    </Container>
  );
};

export default Order;
