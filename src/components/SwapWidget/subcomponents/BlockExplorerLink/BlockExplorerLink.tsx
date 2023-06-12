import React from "react";
import { useTranslation } from "react-i18next";

import { getReceiptUrl } from "@airswap/utils";

import Icon from "../../../Icon/Icon";
import { Link, LinkTextWrapper, LinkText } from "./BlockExplorerLink.styles";

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
    <Link
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={t("wallet.transactionLink")}
      href={`${getReceiptUrl(chainId, txHash)}`}
    >
      <LinkTextWrapper>
        <LinkText>{t("orders.transactionLink")}</LinkText>
        <Icon iconSize={1} name="transaction-link" />
      </LinkTextWrapper>
    </Link>
  );
};

export default BlockExplorerLink;
