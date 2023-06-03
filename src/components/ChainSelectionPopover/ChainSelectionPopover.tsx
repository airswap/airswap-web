import { useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";

import { ChainIds } from "@airswap/constants";

import { useAppDispatch } from "../../app/hooks";
import nativeCurrency from "../../constants/nativeCurrency";
import { CHAIN_PARAMS } from "../../constants/supportedNetworks";
import { setWalletConnected } from "../../features/wallet/walletSlice";
import {
  Container,
  NetworksContainer,
  NetworkButton,
  NetworkIcon,
} from "./ChainSelectionPopover.styles";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type ChainSelectionPopoverPropsType = {
  chainId: number | undefined;
  account: string | undefined | null;
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

  const handleNetworkSwitch = async (chainId: string) => {
    dispatch(
      setWalletConnected({
        address: account || "0x",
        // chainId: +CHAIN_PARAMS[Number(chainId)].chainId,
        chainId: nativeCurrency[+chainId].chainId,
      })
    );
    // try updatin network on injected wallet.
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          { chainId: `0x${nativeCurrency[+chainId].chainId.toString(16)}` },
        ],
      });
    } catch (error: any) {
      // if chain doesn't exist on injected wallet, prompt user to add chain
      if (error.code === 4902) {
        console.log(CHAIN_PARAMS[+chainId]);
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [CHAIN_PARAMS[+chainId]],
          });
        } catch (error: any) {
          console.error("Failed to add chain", error);
        }
      }
    }
  };

  // supportedNetworks returns an array of numbers as strings
  const supportedNetworks = Object.keys(CHAIN_PARAMS);
  console.log(supportedNetworks);

  /**
   * @remarks argument `chain` is a chainId in string format
   */
  const networkButtons = supportedNetworks
    .filter(
      (id) =>
        +id === ChainIds.MAINNET ||
        +id === ChainIds.AVALANCHE ||
        +id === ChainIds.BSC ||
        +id === ChainIds.POLYGON
    )
    .map((chain: string) => {
      return (
        <NetworkButton
          key={chain}
          $isActive={chainId?.toString() === chain}
          onClick={() => handleNetworkSwitch(chain)}
        >
          <NetworkIcon
            src={nativeCurrency[Number(chain)]?.logoURI}
            alt={`${chain} icon`}
          />
          {/* {nativeCurrency[Number(chain)]} */}
          {CHAIN_PARAMS[Number(chain)].chainName}
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
