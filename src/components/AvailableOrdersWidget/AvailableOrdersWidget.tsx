import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { AppRoutes } from "../../routes";
import { Container } from "./AvailableOrdersWidget.styles";
import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";

export type AvailableOrdersSortType = "senderToken" | "signerToken" | "rate";

export type AvailableOrdersWidgetProps = {
  onOrderLinkClick: () => void;
};

const AvailableOrdersWidget = ({
  onOrderLinkClick,
}: AvailableOrdersWidgetProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleCreateSwapClick = () => {
    history.push({
      pathname: `/${AppRoutes.make}`,
    });
  };

  return (
    <Container>
      <AvailableOrdersList
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
