import React from "react";
import { useTranslation } from "react-i18next";

import { getReceiptUrl } from "@airswap/utils";

import Icon from "../../../Icon/Icon";
import {
  Container,
  Link,
  IconContainer,
} from "./BlockExplorerLink.styles";

type BlockEplorerLinkProps = {
  chainId: number;
  txHash: string;
  className?: string;
};

const BlockExplorerLink = ({
  chainId,
  txHash,
  className = "",
}: BlockEplorerLinkProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Link
          className={className}
          target="_blank"
          rel="noreferrer"
          aria-label={t("orders.transactionLink")}
          href={`${getReceiptUrl(chainId, txHash)}`}
        >
          {t("orders.transactionLink")}
        </Link>
        <Link
          className={className}
          target="_blank"
          rel="noreferrer"
          aria-label={t("orders.transactionLink")}
          href={`${getReceiptUrl(chainId, txHash)}`}
        >
          <IconContainer>
            <Icon iconSize={1} name="transaction-link" />
          </IconContainer>
        </Link>
      </Container>
    </>
  );
};

export default BlockExplorerLink;
