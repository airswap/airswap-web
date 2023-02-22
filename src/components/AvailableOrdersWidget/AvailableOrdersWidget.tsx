import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersList from "./subcomponents/AvailableOrdersList/AvailableOrdersList";
import AvailableOrdersWidgetHeader from "./subcomponents/AvailableOrdersWidgetHeader/AvailableOrdersWidgetHeader";

export type AvailableOrdersSortType = "senderToken" | "signerToken" | "rate";

const AvailableOrdersWidget = (): JSX.Element => {
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
      <ActionButton title={"Create a Swap"} onClick={() => {}} />
    </>
  );
};

export default AvailableOrdersWidget;
