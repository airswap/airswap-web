import { useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SUPPORTED_NETWORKS } from "../../constants/supportedNetworks";
import {
  selectWallet,
  setWalletConnected,
} from "../../features/wallet/walletSlice";
import {
  Container,
  NetworksContainer,
  NetworkButton,
  NetworkIcon,
} from "./ChainSelectionPopover.styles";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type ChainSelectionPopoverPropsType = {
  open: boolean;
  popoverRef: RefObject<HTMLDivElement>;
  transactionsTabOpen: boolean;
};

/**
 * @remarks this component renders an unordered list with supported networks. Gets rendered onto ChainButton component
 * @param open is a boolean value which determins whether or not to display the popover. Its value is the state value `chainsOpen` which originates in Wallet.tsx and gets passed down to ChainButton, when then gets passed into this
 * @param transactionsTabOpen is a boolean value which indicates whether the right-side drawer that displays transactions is open. This drawer opens when a user clicks on WalletButton. This prop exists in this component so it appropriately shifts to the left when the drawer opens
 * @returns container with a list of supported EVM networks
 */
const ChainSelectionPopover = ({
  open,
  popoverRef,
  transactionsTabOpen,
}: ChainSelectionPopoverPropsType) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const walletState = useAppSelector(selectWallet);
  const { t } = useTranslation();

  const chainId = walletState.chainId;
  const address = walletState.address;

  const handleNetworkSwitch = (network: string) => {
    dispatch(
      setWalletConnected({
        address: address || "0x",
        chainId: SUPPORTED_NETWORKS[network].chainId,
      })
    );

    // update network on injected wallet
    (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        { chainId: `0x${SUPPORTED_NETWORKS[network].chainId.toString(16)}` },
      ],
    });
  };

  const supportedNetworks = Object.keys(SUPPORTED_NETWORKS);

  const networkButtons = supportedNetworks.map((chain: string) => {
    return (
      <NetworkButton
        key={chain}
        $isActive={chainId?.toString() === chain}
        onClick={() => handleNetworkSwitch(chain)}
      >
        <NetworkIcon
          src={SUPPORTED_NETWORKS[chain].icon}
          alt={`${chain} icon`}
        />{" "}
        {chain}
      </NetworkButton>
    );
  });

  return (
    <Container ref={popoverRef} open={open} shiftLeft={transactionsTabOpen}>
      {/* TODO: t('common.networks') is not translating correctly */}
      <PopoverSection title={t("common.networks")}>
        <NetworksContainer ref={scrollContainerRef} $overflow={false}>
          {networkButtons}
        </NetworksContainer>
      </PopoverSection>
    </Container>
  );
};

export default ChainSelectionPopover;
