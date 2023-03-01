import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FullOrderERC20 } from "@airswap/typescript";

import useWindowSize from "../../../../hooks/useWindowSize";
import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import Order from "../Order/Order";
import {
  Container,
  OrdersContainer,
  Shadow,
  StyledMyOrdersListSortButtons,
} from "./AvailableOrdersList.styles";

interface MyOrdersListProps {
  activeSortType: AvailableOrdersSortType;
  sortTypeDirection: Record<AvailableOrdersSortType, boolean>;
  onSortButtonClick: (type: AvailableOrdersSortType) => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  activeSortType,
  sortTypeDirection,
  onSortButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth } = useWindowSize();
  const [invertRate, setInvertRate] = useState(false);
  const [containerScrollTop, setContainerScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleRateButtonClick = () => {
    setInvertRate(!invertRate);
  };

  const handleOnContainerScroll = () => {
    setContainerScrollTop(containerRef.current?.scrollTop || 0);
  };

  useEffect(() => {
    containerRef.current?.addEventListener(
      "scroll",
      handleOnContainerScroll.bind(this)
    );

    return containerRef.current?.removeEventListener(
      "scroll",
      handleOnContainerScroll.bind(this)
    );
  }, [containerRef]);

  useEffect(() => {
    setContainerWidth(containerRef.current?.scrollWidth || 0);
  }, [containerRef, windowWidth]);

  const TEST_ORDER: FullOrderERC20 = {
    chainId: 5,
    swapContract: "0xE6E821F477f892C110A578517022629C5ef978b6",
    nonce: "1677639612311",
    expiry: "1677643212",
    signerWallet: "0x6Dd33C46a67275396C070cD2F1EdA4DE2dF18d91",
    signerToken: "0x79c950c7446b234a6ad53b908fbf342b01c4d446",
    signerAmount: "22000000",
    protocolFee: "7",
    senderWallet: "0x0000000000000000000000000000000000000000",
    senderToken: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    senderAmount: "1000000000000000000",
    v: "27",
    r: "0x109da035a17cd6f1224f86ec3387e052e2de91943e5407ae7725733fe30138b0",
    s: "0x779ccd046f939126c2e3d9fe071d3eb184f6e5f8f926986da0673ff880536988",
  };

  return (
    <Container className={className}>
      <StyledMyOrdersListSortButtons
        width={containerWidth}
        activeSortType={activeSortType}
        sortTypeDirection={sortTypeDirection}
        senderTokenSymbol={"ETH"}
        signerTokenSymbol={"PRINTS"}
        invertRate={invertRate}
        onSortButtonClick={onSortButtonClick}
        onRateButtonClick={handleRateButtonClick}
      />
      <OrdersContainer ref={containerRef}>
        <Order order={TEST_ORDER} index={1} invertRate={invertRate} />
      </OrdersContainer>
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
