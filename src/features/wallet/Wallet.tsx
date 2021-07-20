import { Light } from "@airswap/protocols";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import WalletButton from "../../components/WalletButton/WalletButton";
import WalletProviderList from "../../components/WalletProviderList/WalletProviderList";
import Modal from "react-modal";
import {
  AbstractConnector,
  WalletProvider,
} from "../../constants/supportedWalletProviders";
import { subscribeToTransfersAndApprovals } from "../balances/balancesApi";
import {
  decrementBalanceBy,
  incrementBalanceBy,
  requestActiveTokenAllowances,
  requestActiveTokenBalances,
  selectBalances,
  setAllowance,
} from "../balances/balancesSlice";
import { fetchAllTokens, selectActiveTokens } from "../metadata/metadataSlice";
import {
  clearLastAccount,
  loadLastAccount,
  saveLastAccount,
} from "./walletAPI";
import {
  setWalletConnected,
  setWalletDisconnected,
  selectWallet,
} from "./walletSlice";
import SUPPORTED_WALLET_PROVIDERS from "../../constants/supportedWalletProviders";

type WalletProps = {
  className?: string;
}

export const Wallet: FC<WalletProps> = ({ className = "" }) => {
  const {
    chainId,
    account,
    activate,
    deactivate,
    active,
    library,
  } = useWeb3React<Web3Provider>();

  // Redux
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);
  const { providerName } = useAppSelector(selectWallet);

  // Analytics
  const { trackPageView } = useMatomo();

  // i18n
  const { t } = useTranslation(["common", "wallet"]);

  // Local component state
  const [showConnectorList, setShowConnectorList] = useState<boolean>(false);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [connector, setConnector] = useState<AbstractConnector>();
  const [provider, setProvider] = useState<WalletProvider>();

  // Auto-activate if user has connected before on (first render)
  useEffect(() => {
    trackPageView({ documentTitle: "Swap Page", href: "https://airswap.io" });
    const lastConnectedAccount = loadLastAccount();
    if (lastConnectedAccount) {
      setIsActivating(true);
      const connector = lastConnectedAccount.provider.getConnector();
      setConnector(connector);
      setProvider(lastConnectedAccount.provider);
      activate(connector).finally(() => setIsActivating(false));
    }
  }, [activate, trackPageView]);

  // Side effects for connecting a wallet from SwapWidget

  useEffect(() => {
    if (providerName) {
      const provider = SUPPORTED_WALLET_PROVIDERS.find(
        (provider) => provider.name === providerName
      );
      setProvider(provider);
      setConnector(provider!.getConnector());
    }
  }, [providerName]);

  // Trigger request for balances and allowances once account is connected
  useEffect(() => {
    if (active && account && chainId && library && connector && provider) {
      // Dispatch a general action to indicate wallet has changed
      dispatch(
        setWalletConnected({
          chainId,
          address: account,
        })
      );
      saveLastAccount(account, provider);
      dispatch(fetchAllTokens());
      dispatch(
        requestActiveTokenAllowances({
          provider: library,
        })
      );
      dispatch(
        requestActiveTokenBalances({
          provider: library,
        })
      );
    } else {
      dispatch(setWalletDisconnected());
    }
  }, [active, account, chainId, dispatch, library, connector, provider]);

  // Subscribe to changes in balance
  useEffect(() => {
    if (
      !library ||
      !account ||
      !connector ||
      chainId === undefined ||
      !activeTokens.length ||
      balances.lastFetch === null ||
      balances.status !== "idle"
    )
      return;

    let teardownTransferListener: () => void;
    if (activeTokens.length) {
      teardownTransferListener = subscribeToTransfersAndApprovals({
        activeTokenAddresses: activeTokens.map((t) => t.address),
        provider: library,
        walletAddress: account,
        spenderAddress: Light.getAddress(),
        onBalanceChange: (tokenAddress, amount, direction) => {
          const actionCreator =
            direction === "in" ? incrementBalanceBy : decrementBalanceBy;
          dispatch(
            actionCreator({
              tokenAddress,
              amount: amount.toString(),
            })
          );
        },
        onApproval: (tokenAddress, amount) => {
          dispatch(
            setAllowance({
              tokenAddress,
              amount: amount.toString(),
            })
          );
        },
      });
    }
    return () => {
      if (teardownTransferListener) {
        teardownTransferListener();
      }
    };
  }, [
    activeTokens,
    account,
    library,
    connector,
    dispatch,
    chainId,
    balances.lastFetch,
    balances.status,
  ]);

  return (
    <div className={className}>
      <Modal
        isOpen={showConnectorList}
        onRequestClose={() => setShowConnectorList(false)}
        overlayClassName="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-10"
        className="w-64 p-4 rounded-sm bg-white dark:bg-gray-800 shadow-lg"
      >
        <WalletProviderList
          onProviderSelected={(provider) => {
            setProvider(provider);
            const connector = provider.getConnector();
            setConnector(connector);
            setShowConnectorList(false);
            setIsActivating(true);
            activate(connector).finally(() => setIsActivating(false));
          }}
        />
      </Modal>
      <WalletButton
        address={account}
        onConnectWalletClicked={() => {
          setShowConnectorList(true);
        }}
        onDisconnectWalletClicked={() => {
          clearLastAccount();
          deactivate();
          if (connector instanceof WalletConnectConnector) {
            connector.close();
          }
        }}
        isConnecting={isActivating}
      />
      <div>
        {t("common:chainId")}: {chainId}
      </div>
    </div>
  );
};
