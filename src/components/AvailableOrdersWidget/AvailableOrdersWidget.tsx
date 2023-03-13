import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { MakerRegistry } from "@airswap/libraries";
import { TokenInfo } from "@airswap/types";
import { unwrapResult } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchIndexerUrls,
  getFilteredOrders,
  selectIndexerReducer,
} from "../../features/indexer/indexerSlice";
import { request, selectBestOption } from "../../features/orders/ordersSlice";
import { AppRoutes } from "../../routes";
import { Container } from "./AvailableOrdersWidget.styles";
import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";

export type AvailableOrdersSortType = "senderToken" | "signerToken" | "rate";

export type AvailableOrdersWidgetProps = {
  senderToken: TokenInfo;
  signerToken: TokenInfo;
  senderAmount: string;
  onOrderLinkClick: () => void;
};

const AvailableOrdersWidget = ({
  senderToken,
  signerToken,
  senderAmount,
  onOrderLinkClick,
}: AvailableOrdersWidgetProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const { account, library, chainId } = useWeb3React();
  const bestTradeOption = useAppSelector(selectBestOption);
  const { indexerUrls, orders } = useAppSelector(selectIndexerReducer);
  const dispatch = useAppDispatch();

  const cushion = new BigNumber(senderAmount).dividedBy(4, 18);
  const minSenderAmount = new BigNumber(senderAmount).minus(cushion).toString();
  const maxSenderAmount = new BigNumber(senderAmount).plus(cushion).toString();

  /*useMemo(async () => {
    const makers = await new MakerRegistry(
      chainId!,
      // @ts-ignore provider type mismatch
      library!
    ).getMakers(signerToken.address, senderToken.address, {
      initializeTimeout: 10 * 1000,
    });
    console.log(makers);
    const result = dispatch(
      request({
        makers: makers.filter((s) => s.supportsProtocol("request-for-quote")),
        signerToken: signerToken.address,
        senderToken: senderToken.address,
        senderAmount: "100000000000000000000000",
        senderTokenDecimals: 18,
        senderWallet: account!,
      })
    );
    result
      .then((result) => {
        return unwrapResult(result);
      })
      .then((orders) => {
        if (!orders.length) console.log("no valid orders");
        console.log(orders);
      });
  }, [account, chainId, dispatch, library, senderToken, signerToken]);*/

  useMemo(() => {
    dispatch(fetchIndexerUrls({ provider: library! }));
  }, [dispatch, library]);

  useMemo(() => {
    if (indexerUrls) {
      dispatch(
        getFilteredOrders({
          filter: {
            senderTokens: [senderToken.address],
            signerTokens: [signerToken.address],
            page: 1,
            minSenderAmount: BigInt(minSenderAmount),
            maxSenderAmount: BigInt(maxSenderAmount),
          },
        })
      );
    }
  }, [
    dispatch,
    indexerUrls,
    maxSenderAmount,
    minSenderAmount,
    senderToken.address,
    signerToken.address,
  ]);

  const handleCreateSwapClick = () => {
    history.push({
      pathname: `/${AppRoutes.make}`,
    });
  };

  return (
    <Container>
      <AvailableOrdersList
        orders={orders}
        senderToken={senderToken.symbol}
        signerToken={signerToken.symbol}
        activeSortType="rate"
        sortTypeDirection={{
          senderToken: false,
          signerToken: false,
          rate: false,
        }}
        onSortButtonClick={() => {}}
        onOrderLinkClick={onOrderLinkClick}
      />
      <ActionButton
        title={t("orders.createSwap")}
        onClick={handleCreateSwapClick}
      />
    </Container>
  );
};

export default AvailableOrdersWidget;
