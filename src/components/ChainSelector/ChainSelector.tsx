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

/**
 * @param chainSelectionOpen boolean value which controls the display of the arrow
 * @param transactionsTabOpen is a boolean value which indicates whether the right-side drawer that displays transactions is open. This drawer opens when a user clicks on WalletButton. This prop exists in this component so it appropriately shifts to the left when the drawer opens
 * @param setChainSelectionOpen useState setter function which controls chainSelectionOpen boolean value
 * @returns button that when clicked, opens a popover with a list of supported networks
 */
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
    document.addEventListener("keydown", handleEscKey, false);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscKey, false);
    };
  }, []);

  return (
    <Container
      className={className}
      ref={containerRef}
      open={chainSelectionOpen}
      shiftLeft={transactionsTabOpen}
    >
      <ChainSelectButton
        onClick={() => {
          setChainSelectionOpen(!chainSelectionOpen);
        }}
      >
        <ChainIcon src={nativeCurrency[chainId].logoURI} />
        <ChainNameText>{CHAIN_PARAMS[chainId].chainName}</ChainNameText>
        <ArrowIcon open={chainSelectionOpen}>
          <GoChevronDown />
        </ArrowIcon>
      </ChainSelectButton>
      {chainSelectionOpen && (
        <StyledChainSelectionPopover
          chainId={chainId}
          open={chainSelectionOpen}
          popoverRef={popoverRef}
          transactionsTabOpen={transactionsTabOpen}
        />
      )}
    </Container>
  );
};

export default ChainSelector;
