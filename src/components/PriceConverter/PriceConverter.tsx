import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToggle } from "react-use";

import BigNumber from "bignumber.js";

import { stringToSignificantDecimals } from "../../helpers/stringToSignificantDecimals";
import { InfoSectionHeading } from "../../styled-components/InfoSection/InfoSection";
import { RevertPriceButton } from "./PriceConverter.styles";

interface PriceConverterProps {
  baseTokenSymbol: string;
  price: BigNumber;
  quoteTokenSymbol: string;
  className?: string;
}

export const PriceConverter: FC<PriceConverterProps> = ({
  baseTokenSymbol,
  price,
  quoteTokenSymbol,
  className,
}) => {
  const { t } = useTranslation();

  const [isPriceInverted, toggleIsPriceInverted] = useToggle(false);

  const invertedPrice = new BigNumber(1).dividedBy(price);
  const chosenPrice = isPriceInverted ? invertedPrice : price;

  return (
    <InfoSectionHeading className={className}>
      1 {isPriceInverted ? quoteTokenSymbol : baseTokenSymbol} ={" "}
      {stringToSignificantDecimals(chosenPrice.toString())}{" "}
      {isPriceInverted ? baseTokenSymbol : quoteTokenSymbol}
      <RevertPriceButton
        icon="swap"
        ariaLabel={t("orders.revertPrice")}
        iconSize={1}
        onClick={toggleIsPriceInverted}
      />
    </InfoSectionHeading>
  );
};
