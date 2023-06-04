import { RefObject, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import nativeCurrency from "../../constants/nativeCurrency";
import {
  CHAIN_PARAMS,
  SUPPORTED_NETWORKS,
} from "../../constants/supportedNetworks";
import {
  Container,
  NetworksContainer,
  NetworkButton,
  NetworkIcon,
} from "./ChainSelectionPopover.styles";
import addAndSwitchToEthereumChain from "./helpers/addAndSwitchToEthereumChain";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type ChainSelectionPopoverPropsType = {
  chainId: number;
  open: boolean;
  popoverRef: RefObject<HTMLDivElement>;
  transactionsTabOpen: boolean;
  className?: string;
};

/**
 * @remarks this component renders an unordered list with supported networks. Gets rendered onto ChainSelector component
 * @param chainId originates from useWeb3React in Wallet.tsx, then passed into ChainSelector, then here
 * @param open is a boolean value which determins whether or not to display the popover. Its value is the state value `chainsOpen` which originates in Wallet.tsx and gets passed down to ChainSelector, when then gets passed into this
 * @param transactionsTabOpen is a boolean value which indicates whether the right-side drawer that displays transactions is open. This drawer opens when a user clicks on WalletButton. This prop exists in this component so it appropriately shifts to the left when the drawer opens
 * @returns container with a list of supported EVM networks
 */
const ChainSelectionPopover = ({
  chainId,
  open,
  popoverRef,
  transactionsTabOpen,
  className,
}: ChainSelectionPopoverPropsType) => {
  const { t } = useTranslation();
  const { active } = useWeb3React<Web3Provider>();

  const handleNetworkButtonClick = (chainId: number) => {
    addAndSwitchToEthereumChain(chainId);
  };

  const networkButtons = useMemo(() => {
    return SUPPORTED_NETWORKS.map((chain) => {
      return (
        <NetworkButton
          key={chain}
          $isActive={chainId === chain}
          onClick={() => handleNetworkButtonClick(chain)}
        >
          <NetworkIcon src={nativeCurrency[chain]?.logoURI} />
          {CHAIN_PARAMS[chain].chainName}
        </NetworkButton>
      );
    });
  }, [chainId]);

  return (
    <Container
      ref={popoverRef}
      open={open}
      shiftLeft={transactionsTabOpen}
      connected={active}
      className={className}
    >
      <PopoverSection title={t("common.networks")}>
        <NetworksContainer>{networkButtons}</NetworksContainer>
      </PopoverSection>
    </Container>
  );
};

export default ChainSelectionPopover;
