import { useMemo, useState } from "react";
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
import { getSortedIndexerOrders } from "./helpers/getSortedIndexerOrders";
import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";

export type AvailableOrdersSortType = "senderAmount" | "signerAmount" | "rate";

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
  const { library } = useWeb3React();
  const { indexerUrls, orders } = useAppSelector(selectIndexerReducer);
  const dispatch = useAppDispatch();

  const [errorText, setErrorText] = useState<string>();
  const [sortType, setSortType] =
    useState<AvailableOrdersSortType>("senderAmount");
  const [sortTypeDirection, setSortTypeDirection] = useState({
    senderAmount: false,
    signerAmount: false,
    rate: false,
  });
  const [invertRate, setInvertRate] = useState(false);

  const cushion = new BigNumber(senderAmount).dividedBy(4, 18);
  const minSenderAmount = new BigNumber(senderAmount).minus(cushion).toString();
  const maxSenderAmount = new BigNumber(senderAmount).plus(cushion).toString();

  useMemo(() => {
    const fetchIndexers = dispatch(fetchIndexerUrls({ provider: library! }));
    fetchIndexers.then((res: any) => {
      !res.payload.length && setErrorText("No indexers");
    });
  }, [dispatch, library]);

  useMemo(() => {
    if (indexerUrls) {
      const fetchOrders = dispatch(
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
      fetchOrders.then((res: any) => {
        !res.payload.length && setErrorText("No orders");
      });
    }
  }, [
    dispatch,
    indexerUrls,
    maxSenderAmount,
    minSenderAmount,
    senderToken.address,
    signerToken.address,
  ]);

  const sortedOrders = useMemo(() => {
    if (orders) {
      const isReverse =
        sortType === "rate" && invertRate
          ? sortTypeDirection["rate"]
          : !sortTypeDirection[sortType];
      return getSortedIndexerOrders(orders, sortType, isReverse);
    }
  }, [invertRate, orders, sortType, sortTypeDirection]);

  const handleSortButtonClick = (selectedSortType: AvailableOrdersSortType) => {
    if (selectedSortType === sortType) {
      setSortTypeDirection({
        senderAmount:
          sortType === "senderAmount"
            ? !sortTypeDirection.senderAmount
            : sortTypeDirection.senderAmount,
        signerAmount:
          sortType === "signerAmount"
            ? !sortTypeDirection.signerAmount
            : sortTypeDirection.signerAmount,
        rate:
          sortType === "rate"
            ? !sortTypeDirection.rate
            : sortTypeDirection.rate,
      });
    } else {
      setSortType(selectedSortType);
    }
  };

  const handleRateButtonClick = () => {
    setInvertRate(!invertRate);
  };

  const handleCreateSwapClick = () => {
    history.push({
      pathname: `/${AppRoutes.make}`,
    });
  };

  return (
    <Container>
      <AvailableOrdersList
        orders={sortedOrders}
        errorText={errorText}
        senderToken={senderToken.symbol}
        signerToken={signerToken.symbol}
        activeSortType={sortType}
        sortTypeDirection={sortTypeDirection}
        invertRate={invertRate}
        onRateButtonClick={handleRateButtonClick}
        onSortButtonClick={handleSortButtonClick}
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
