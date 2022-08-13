import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import writeAddressToClipboard from "../../../../helpers/writeAddressToClipboard";
import { OrderType } from "../../../../types/orderTypes";
import {
  Button,
  For,
  InfoWrapper,
  StyledCheckIcon,
  StyledCopyIcon,
  You,
} from "./OrderRecipientInfo.styles";

type OrderRecipientInfoProps = {
  orderType: OrderType;
  recipientAddress?: string;
  userAddress?: string;
  className?: string;
};

const OrderRecipientInfo: FC<OrderRecipientInfoProps> = ({
  orderType,
  recipientAddress,
  userAddress,
  className,
}) => {
  const { t } = useTranslation();

  const [writeAddressToClipboardSuccess, setWriteAddressToClipboardSuccess] =
    useState(false);

  const handleClick = async () => {
    if (recipientAddress === "address") {
      setWriteAddressToClipboardSuccess(
        await writeAddressToClipboard(recipientAddress)
      );
    }
  };

  if (
    recipientAddress &&
    recipientAddress !== userAddress &&
    orderType === OrderType.private
  ) {
    return (
      <Button onClick={handleClick} className={className}>
        <For>{`${t("common.for")}:`}</For>
        {`${recipientAddress.substr(0, 3)}...${recipientAddress.substr(
          recipientAddress.length - 3,
          3
        )}`}
        <StyledCopyIcon
          name={writeAddressToClipboardSuccess ? "check" : "copy"}
          iconSize={0.875}
        />
      </Button>
    );
  }

  return (
    <InfoWrapper onClick={handleClick} className={className}>
      <For>{`${t("common.for")}:`}</For>
      {recipientAddress === userAddress ? (
        <>
          <You>{t("common.you")}</You>
          <StyledCheckIcon name="check" />
        </>
      ) : (
        t("orders.anyone")
      )}
    </InfoWrapper>
  );
};

export default OrderRecipientInfo;
