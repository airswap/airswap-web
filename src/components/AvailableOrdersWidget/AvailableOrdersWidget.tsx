import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { OrderERC20, TokenInfo } from "@airswap/types";

import { useAppSelector } from "../../app/hooks";
import { selectIndexerReducer } from "../../features/indexer/indexerSlice";
import { AppRoutes } from "../../routes";
import { Container } from "./AvailableOrdersWidget.styles";
import { getSortedIndexerOrders } from "./helpers/getSortedIndexerOrders";
import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";

export type AvailableOrdersSortType = "senderAmount" | "signerAmount" | "rate";

export type AvailableOrdersWidgetProps = {
  senderToken: TokenInfo;
  signerToken: TokenInfo;
  bestSwapOption?: OrderERC20;
  onOrderLinkClick: (showQuotes: boolean) => void;
};

const AvailableOrdersWidget = ({
  senderToken,
  signerToken,
  bestSwapOption,
  onOrderLinkClick,
}: AvailableOrdersWidgetProps): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation();
  const { orders, isLoading, noIndexersFound } =
    useAppSelector(selectIndexerReducer);

  const [invertRate, setInvertRate] = useState(false);
  const [sortType, setSortType] =
    useState<AvailableOrdersSortType>("senderAmount");
  const [sortTypeDirection, setSortTypeDirection] = useState({
    senderAmount: false,
    signerAmount: false,
    rate: false,
  });

  const sortedOrders = useMemo(() => {
    if (orders) {
      const orderToSort = bestSwapOption ? [...orders, bestSwapOption] : orders;
      const isReverse =
        sortType === "rate" && invertRate
          ? sortTypeDirection["rate"]
          : !sortTypeDirection[sortType];
      return getSortedIndexerOrders(orderToSort, sortType, isReverse);
    }
  }, [bestSwapOption, invertRate, orders, sortType, sortTypeDirection]);

  const helperText = useMemo(() => {
    if (isLoading) {
      return null;
    }

    if (noIndexersFound) {
      return t("orders.noIndexersFound");
    }

    if (orders.length === 0) {
      return t("orders.noIndexerOrdersFound");
    }

    return null;
  }, [isLoading, noIndexersFound, orders.length, t]);

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
        helperText={helperText}
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
