import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import writeTextToClipboard from "../../../../helpers/writeTextToClipboard";
import useEnsAddress from "../../../../hooks/useEnsAddress";
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

  const recipientEnsAddress = useEnsAddress(recipientAddress);
  const readableAddress = recipientEnsAddress || recipientAddress;

  const handleClick = async () => {
    if (readableAddress) {
      setWriteAddressToClipboardSuccess(
        await writeTextToClipboard(readableAddress)
      );
    }
  };

  if (
    recipientAddress &&
    readableAddress &&
    recipientAddress !== userAddress &&
    orderType === OrderType.private
  ) {
    return (
      <Button onClick={handleClick} className={className}>
        <For>{`${t("common.for")}:`}</For>
        {`${readableAddress.substr(0, 3)}...${readableAddress.substr(
          readableAddress.length - 3,
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
        <>{t("orders.anyone")}</>
      )}
    </InfoWrapper>
  );
};

export default OrderRecipientInfo;
