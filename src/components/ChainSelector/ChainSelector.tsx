import { useCallback, useEffect, useRef } from "react";
import { GoChevronDown } from "react-icons/go";

import nativeCurrency from "../../constants/nativeCurrency";
import { CHAIN_PARAMS } from "../../constants/supportedNetworks";
import ChainSelectionPopover from "../ChainSelectionPopover/ChainSelectionPopover";
import {
  Container,
  ChainSelectButton,
  ChainIcon,
  ArrowIcon,
  ChainNameText,
  StyledChainSelectionPopover,
} from "./ChainSelector.style";

type ChainSelectorType = {
  chainId: number;
  chainSelectionOpen: boolean;
  transactionsTabOpen: boolean;
  setChainSelectionOpen: (x: boolean) => void;
  className?: string;
};

const ChainSelector = ({
  chainId,
  chainSelectionOpen,
  transactionsTabOpen,
  setChainSelectionOpen,
  className,
}: ChainSelectorType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e) => {
    if (
      (containerRef.current && containerRef.current.contains(e.target)) ||
      (popoverRef.current && popoverRef.current.contains(e.target))
    ) {
      return;
    }
    setChainSelectionOpen(false);
  }, []);

  const handleEscKey = useCallback((e) => {
    if (e.keyCode === 27) {
      setChainSelectionOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <Container
      className={className}
      ref={containerRef}
      isOpen={chainSelectionOpen}
      shiftLeft={transactionsTabOpen}
    >
      <ChainSelectButton
        onClick={() => {
          setChainSelectionOpen(!chainSelectionOpen);
        }}
      >
        <ChainIcon src={nativeCurrency[chainId].logoURI} />
        <ChainNameText>{CHAIN_PARAMS[chainId].chainName}</ChainNameText>
        <ArrowIcon isOpen={chainSelectionOpen}>
          <GoChevronDown />
        </ArrowIcon>
      </ChainSelectButton>
      {chainSelectionOpen && (
        <StyledChainSelectionPopover
          chainId={chainId}
          popoverRef={popoverRef}
        />
      )}
    </Container>
  );
};

export default ChainSelector;
