import { useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import nativeCurrency from "../../constants/nativeCurrency";
import {
  CHAIN_PARAMS,
  SUPPORTED_NETWORKS,
} from "../../constants/supportedNetworks";
import { setWalletConnected } from "../../features/wallet/walletSlice";
import {
  Container,
  NetworksContainer,
  NetworkButton,
  NetworkIcon,
} from "./ChainSelectionPopover.styles";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type ChainSelectionPopoverPropsType = {
  chainId: number;
  account: string;
  open: boolean;
  popoverRef: RefObject<HTMLDivElement>;
  transactionsTabOpen: boolean;
};

/**
 * @remarks this component renders an unordered list with supported networks. Gets rendered onto ChainButton component
 * @param chainId originates from useWeb3React in Wallet.tsx, then passed into ChainButton, then here
 * @param account originates from useWeb3React in Wallet.tsx, then passed into ChainButton, then here
 * @param open is a boolean value which determins whether or not to display the popover. Its value is the state value `chainsOpen` which originates in Wallet.tsx and gets passed down to ChainButton, when then gets passed into this
 * @param transactionsTabOpen is a boolean value which indicates whether the right-side drawer that displays transactions is open. This drawer opens when a user clicks on WalletButton. This prop exists in this component so it appropriately shifts to the left when the drawer opens
 * @returns container with a list of supported EVM networks
 */
const ChainSelectionPopover = ({
  chainId,
  account,
  open,
  popoverRef,
  transactionsTabOpen,
}: ChainSelectionPopoverPropsType) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleNetworkSwitch = async (chainId: number) => {
    dispatch(
      setWalletConnected({
        address: account || "0x",
        chainId: nativeCurrency[+chainId].chainId,
      })
    );
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${nativeCurrency[chainId].chainId.toString(16)}`,
          },
        ],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        const chain = CHAIN_PARAMS[chainId];

        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{ chainId: SUPPORTED_NETWORKS[chainId] }],
          });
        } catch (error: any) {
          console.error("Failed to add chain", error);
        }
      }
    }
  };

  const networkButtons = SUPPORTED_NETWORKS.map((chain) => {
    return (
      <NetworkButton
        key={chain}
        $isActive={chainId === chain}
        onClick={() => handleNetworkSwitch(+chain)}
      >
        <NetworkIcon src={nativeCurrency[chain]?.logoURI} />
        {CHAIN_PARAMS[chain].chainName}
      </NetworkButton>
    );
  });

  return (
    <Container
      ref={popoverRef}
      open={open}
      shiftLeft={transactionsTabOpen}
      connected={!!account}
    >
      {/* @ts-ignore */}
      <PopoverSection title={t("common.networks")}>
        <NetworksContainer ref={scrollContainerRef} $overflow={false}>
          {networkButtons}
        </NetworksContainer>
      </PopoverSection>
    </Container>
  );
};

export default ChainSelectionPopover;
