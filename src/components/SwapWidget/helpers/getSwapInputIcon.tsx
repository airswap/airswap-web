import { ReactElement } from "react";

import Icon from "../../Icon/Icon";

export default function getSwapInputIcon(
  tradeNotAllowed: boolean,
  hasToAmount: boolean
): ReactElement {
  if (tradeNotAllowed) {
    return <Icon name="forbidden" iconSize={0.9375} />;
  }

  if (hasToAmount) {
    return <Icon name="arrow-down" iconSize={0.8125} />;
  }

  return <Icon name="swap" iconSize={0.9375} />;
}
