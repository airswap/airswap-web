import Icon from "../../Icon/Icon";
import { ReactElement } from "react";

export default function getSwapInputIcon(
  tradeNotAllowed: boolean,
): ReactElement {
  if (tradeNotAllowed) {
    return <Icon name="forbidden" iconSize={0.9375} />;
  }

  return <Icon name="swap" iconSize={0.8125} />;
}
