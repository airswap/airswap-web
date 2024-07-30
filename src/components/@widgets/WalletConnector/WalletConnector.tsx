import React, { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Connector } from "@web3-react/types";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { getLastProviderFromLocalStorage } from "../../../features/web3/web3Api";
import {
  setConnectionType,
  setIsInitialized,
} from "../../../features/web3/web3Slice";
import useDebounce from "../../../hooks/useDebounce";
import {
  ConnectionType,
  getConnection,
} from "../../../web3-connectors/connections";
import { buildGnosisSafeConnector } from "../../../web3-connectors/gnosis";
import { tryActivateConnector } from "../../../web3-connectors/helpers";
import { WalletProvider } from "../../../web3-connectors/walletProviders";
import Overlay from "../../Overlay/Overlay";
import { StyledWalletProviderList } from "../SwapWidget/SwapWidget.styles";

interface WalletConnectorProps {
  className?: string;
}

const WalletConnector: FC<WalletConnectorProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { isActive, isInitialized } = useAppSelector((state) => state.web3);

  const { showWalletList, setShowWalletList } = useContext(InterfaceContext);

  const [triedToEagerlyConnect, setTriedToEagerlyConnect] = useState(false);
  const [isActiveState, setIsActiveState] = useState(false);

  const activateWallet = async (provider: WalletProvider) => {
    try {
      await tryActivateConnector(getConnection(provider.type).connector);
      dispatch(setConnectionType(provider.type));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setIsInitialized(true));
    }
  };

  const activateWalletEagerly = async (
    connector: Connector,
    type: ConnectionType
  ) => {
    try {
      if (connector.connectEagerly) {
        // Currently connectEagerly does not throw error if connectEagerly fails. So we need to check if it is connected
        // by using the triedToEagerlyConnect state.
        await connector.connectEagerly();
        dispatch(setConnectionType(type));
      }
    } catch (error) {
      console.error(error);
      dispatch(setIsInitialized(true));
    } finally {
      setTriedToEagerlyConnect(true);
    }
  };

  const handleCloseButtonClick = (): void => {
    setShowWalletList(false);
  };

  const handleWalletProviderButtonClick = (provider: WalletProvider): void => {
    if (!provider.isInstalled) {
      window.open(provider.url, "_blank");

      return;
    }

    activateWallet(provider);
  };

  useEffect(() => {
    const type = getLastProviderFromLocalStorage();

    if (!type || isInitialized) {
      dispatch(setIsInitialized(true));

      return;
    }

    activateWalletEagerly(getConnection(type).connector, type);
  }, []);

  useEffect(() => {
    const gnosisSafe = buildGnosisSafeConnector();

    if (isInitialized) {
      return;
    }

    try {
      activateWalletEagerly(gnosisSafe.connector, gnosisSafe.type);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    setIsActiveState(isActive);

    if (!isActive && isActiveState) {
      dispatch(setConnectionType(undefined));
    }
  }, [isActive]);

  useDebounce(
    () => {
      if (triedToEagerlyConnect && !isInitialized) {
        dispatch(setIsInitialized(true));
        setTriedToEagerlyConnect(false);
      }
    },
    100,
    [triedToEagerlyConnect, isActive, isInitialized]
  );

  return (
    <Overlay
      isHidden={!showWalletList}
      title={t("wallet.selectWallet")}
      onClose={handleCloseButtonClick}
      className={className}
    >
      <StyledWalletProviderList
        onClose={handleCloseButtonClick}
        onWalletProviderButtonClick={handleWalletProviderButtonClick}
      />
    </Overlay>
  );
};

export default WalletConnector;
