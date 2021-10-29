import { useCallback, useEffect, useRef } from "react";

import truncateEthAddress from "truncate-eth-address";

import { InfoHeading } from "../Typography/Typography";
import { StyledBlockies } from "../WalletButton/subcomponents/WalletAddress/WalletAddress.styles";
import {
  Container,
  BackgroundOverlay,
  WalletHeader,
  BlockiesContainer,
  WalletLinkContainer,
} from "./TransactionsTab.styles";
import WalletLink from "./subcomponents/WalletLink/WalletLink";

type TransactionsTabType = {
  address: string;
  chainId: number;
  open: boolean;
  setTransactionsTabOpen: (x: boolean) => void;
};

const TransactionsTab = ({
  address = "",
  chainId,
  open,
  setTransactionsTabOpen,
}: TransactionsTabType) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }
      setTransactionsTabOpen(false);
    },
    [setTransactionsTabOpen]
  );

  const handleEscKey = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        setTransactionsTabOpen(false);
      }
    },
    [setTransactionsTabOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscKey, false);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscKey, false);
    };
  }, [handleClick, handleEscKey]);

  return (
    <>
      <BackgroundOverlay open={open} />
      <Container open={open} ref={containerRef}>
        <WalletHeader>
          <BlockiesContainer>
            <StyledBlockies
              size={8}
              scale={5}
              seed={address}
              bgColor="black"
              color="#2b72ff"
            />
          </BlockiesContainer>
          <WalletLinkContainer>
            <InfoHeading>{truncateEthAddress(address!)}</InfoHeading>
            <WalletLink chainId={chainId!} address={address!} />
          </WalletLinkContainer>
        </WalletHeader>
      </Container>
    </>
  );
};

export default TransactionsTab;
