import { useCallback, useEffect, useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import { chainNames } from "@airswap/utils";

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
  setChainSelectionOpen: (x: boolean) => void;
  className?: string;
};

const ChainSelector = ({
  chainId,
  chainSelectionOpen,
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
    >
      <ChainSelectButton
        onClick={() => {
          setChainSelectionOpen(!chainSelectionOpen);
        }}
      >
        <ChainIcon src={`images/networks/${chainId}.png`} />
        <ChainNameText>{chainNames[chainId]}</ChainNameText>
        <ArrowIcon isOpen={chainSelectionOpen}>
          <MdKeyboardArrowDown />
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
