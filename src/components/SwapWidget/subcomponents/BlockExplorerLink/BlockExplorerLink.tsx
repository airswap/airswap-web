import React from "react";
import { useTranslation } from "react-i18next";

import { getReceiptUrl } from "@airswap/utils";

import { Link, Container } from "./BlockExplorerLink.styles";

type BlockEplorerLinkProps = {
  chainId: number | undefined;
  txHash: string | undefined;
  className?: string;
};

const BlockExplorerLink = ({
  chainId,
  txHash,
  className = "",
}: BlockEplorerLinkProps) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Link
        className={className}
        target="_blank"
        rel="noreferrer"
        aria-label={t("wallet.transactionLink")}
        href={`${getReceiptUrl(chainId || 1, txHash || "")}`}
      >
        {t("orders.transactionLink")}
      </Link>
    </Container>
  );
};

export default BlockExplorerLink;
