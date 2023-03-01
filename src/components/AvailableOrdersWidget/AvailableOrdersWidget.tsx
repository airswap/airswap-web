import { useHistory } from "react-router-dom";

import { AppRoutes } from "../../routes";
import Routes from "../Routes/Routes";
import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";
import AvailableOrdersWidgetHeader from "./subcomponents/AvailableOrdersWidgetHeader/AvailableOrdersWidgetHeader";

export type AvailableOrdersSortType = "senderToken" | "signerToken" | "rate";

const AvailableOrdersWidget = (): JSX.Element => {
  const history = useHistory();
  const handleCreateSwapClick = () => {
    history.push({
      pathname: `${AppRoutes.make}`,
    });
  };
  return (
    <>
      <AvailableOrdersWidgetHeader title={"Available swaps"} />
      <AvailableOrdersList
        activeSortType="rate"
        sortTypeDirection={{
          senderToken: false,
          signerToken: false,
          rate: false,
        }}
        onSortButtonClick={() => {}}
      />
      <ActionButton title={"Create a Swap"} onClick={handleCreateSwapClick} />
    </>
  );
};

export default AvailableOrdersWidget;
