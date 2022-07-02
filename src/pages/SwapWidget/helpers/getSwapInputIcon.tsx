import { ReactElement } from "react";

import Icon from "../../../components/Icon/Icon";

export default function getSwapInputIcon(
  tradeNotAllowed: boolean
): ReactElement {
  if (tradeNotAllowed) {
    return <Icon name="forbidden" iconSize={0.9375} />;
  }

  return <Icon name="arrow-down" iconSize={0.8125} />;
}
