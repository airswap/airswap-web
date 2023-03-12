import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchIndexerUrls,
  getFilteredOrders,
  selectIndexerReducer,
} from "../../features/indexer/indexerSlice";
import { AppRoutes } from "../../routes";
import { Container } from "./AvailableOrdersWidget.styles";
import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";

export type AvailableOrdersSortType = "senderToken" | "signerToken" | "rate";

export type AvailableOrdersWidgetProps = {
  senderToken: string;
  signerToken: string;
  onOrderLinkClick: () => void;
};

const AvailableOrdersWidget = ({
  senderToken,
  signerToken,
  onOrderLinkClick,
}: AvailableOrdersWidgetProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const { library } = useWeb3React();
  const { orders } = useAppSelector(selectIndexerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIndexerUrls({ provider: library! }));
    dispatch(
      getFilteredOrders({
        filter: {
          senderTokens: [senderToken],
          signerTokens: [signerToken],
          page: 1,
        },
      })
    );
  }, [dispatch, library, senderToken, signerToken]);

  const handleCreateSwapClick = () => {
    history.push({
      pathname: `/${AppRoutes.make}`,
    });
  };

  return (
    <Container>
      <AvailableOrdersList
        orders={orders}
        senderToken={senderToken}
        signerToken={signerToken}
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
