import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FullOrderERC20, OrderERC20, TokenInfo } from "@airswap/types";

import { useAppSelector } from "../../app/hooks";
import { selectIndexerReducer } from "../../features/indexer/indexerSlice";
import { selectBestOrder } from "../../features/orders/ordersSlice";
import { AppRoutes } from "../../routes";
import { Container } from "./AvailableOrdersWidget.styles";
import { getSortedIndexerOrders } from "./helpers/getSortedIndexerOrders";
import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";

export type AvailableOrdersSortType = "senderAmount" | "signerAmount" | "rate";

export type AvailableOrdersWidgetProps = {
  senderToken: TokenInfo;
  signerToken: TokenInfo;
  onSwapLinkClick: () => void;
  onFullOrderLinkClick?: () => void;
};

const AvailableOrdersWidget = ({
  senderToken,
  signerToken,
  onSwapLinkClick,
  onFullOrderLinkClick,
}: AvailableOrdersWidgetProps): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation();
  const bestRfqOrder = useAppSelector(selectBestOrder);
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
    const ordersToSort: (FullOrderERC20 | OrderERC20)[] = [...orders];

    if (
      bestRfqOrder.senderToken === senderToken.address &&
      bestRfqOrder.signerToken === signerToken.address
    ) {
      ordersToSort.push(bestRfqOrder);
    }

    const isReverse =
      sortType === "rate" && invertRate
        ? sortTypeDirection["rate"]
        : !sortTypeDirection[sortType];

    return getSortedIndexerOrders(ordersToSort, sortType, isReverse);
  }, [invertRate, orders, sortType, sortTypeDirection]);

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
        onSwapLinkClick={onSwapLinkClick}
        onFullOrderLinkClick={onFullOrderLinkClick}
      />
      <ActionButton
        title={t("orders.makeNewOrder")}
        onClick={handleCreateSwapClick}
      />
    </Container>
  );
};

export default AvailableOrdersWidget;
