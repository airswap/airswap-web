import ActionButton from "./subcomponents/ActionButton/ActionButton";
import AvailableOrdersWidgetHeader from "./subcomponents/AvailableOrdersWidgetHeader";

const AvailableOrdersWidget = (): JSX.Element => {
  return (
    <>
      <AvailableOrdersWidgetHeader title={"Available swaps"} />
      <ActionButton title={"Create a Swap"} onClick={() => {}} />
    </>
  );
};

export default AvailableOrdersWidget;
