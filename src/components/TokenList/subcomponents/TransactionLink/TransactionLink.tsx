import React from "react";
import { useTranslation } from "react-i18next";

import { getAccountUrl } from "@airswap/utils";

import Icon from "../../../Icon/Icon";
import { Link } from "./TransactionLink.style";

type TransactionLinkProps = {
  chainId: number;
  address: string;
  className?: string;
};

const TransactionLink = ({
  chainId,
  address,
  className = "",
}: TransactionLinkProps) => {
  const { t } = useTranslation();

  return (
    <Link
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={t("wallet.transactionLink")}
      href={`${getAccountUrl(chainId, address)}`}
    >
      <Icon iconSize={1} name="transaction-link" />
    </Link>
  );
};

export default TransactionLink;
