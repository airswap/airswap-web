import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { nativeCurrencyAddress } from "../../../../constants/nativeCurrency";
import writeAddressToClipboard from "../../../../helpers/writeAddressToClipboard";
import {
  Button,
  For,
  StyledCheckIcon,
  StyledCopyIcon,
  Wrapper,
  You,
} from "./OrderRecipientInfo.styles";

type OrderRecipientInfoProps = {
  address?: string;
  type: "you" | "address" | "anyone";
  className?: string;
};

const OrderRecipientInfo: FC<OrderRecipientInfoProps> = ({
  address = nativeCurrencyAddress,
  type,
  className,
}) => {
  const { t } = useTranslation();

  const [writeAddressToClipboardSuccess, setWriteAddressToClipboardSuccess] =
    useState(false);

  const handleClick = async () => {
    if (type === "address") {
      setWriteAddressToClipboardSuccess(await writeAddressToClipboard(address));
    }
  };

  if (type === "address") {
    return (
      <Button onClick={handleClick} className={className}>
        <For>{`${t("common.for")}:`}</For>
        {`${address.substr(0, 3)}...${address.substr(address.length - 3, 3)}`}
        <StyledCopyIcon
          name={writeAddressToClipboardSuccess ? "check" : "copy"}
          iconSize={0.875}
        />
      </Button>
    );
  }

  return (
    <Wrapper onClick={handleClick} className={className}>
      <For>{`${t("common.for")}:`}</For>
      {type === "you" && (
        <>
          <You>{t("common.you")}</You>
          <StyledCheckIcon name="check" />
        </>
      )}
      {type === "anyone" && t("orders.anyone")}
    </Wrapper>
  );
};

export default OrderRecipientInfo;
