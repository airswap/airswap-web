import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { TokenInfo } from "@airswap/types";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchIndexerUrls,
  getFilteredOrders,
  selectIndexerReducer,
} from "../../features/indexer/indexerSlice";
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
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { library } = useWeb3React();
  const { indexerUrls, orders, errorText } =
    useAppSelector(selectIndexerReducer);

  const [invertRate, setInvertRate] = useState(false);
  const [sortType, setSortType] =
    useState<AvailableOrdersSortType>("senderAmount");
  const [sortTypeDirection, setSortTypeDirection] = useState({
    senderAmount: false,
    signerAmount: false,
    rate: false,
  });
  console.log(senderAmount);
  const minSenderAmount = new BigNumber(senderAmount).times(0.75).toString();
  const maxSenderAmount = new BigNumber(senderAmount).times(1.25).toString();
  console.log(minSenderAmount);

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
            minSenderAmount: !minSenderAmount.includes(".")
              ? BigInt(minSenderAmount)
              : undefined,
            maxSenderAmount: !maxSenderAmount.includes(".")
              ? BigInt(maxSenderAmount)
              : undefined,
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
