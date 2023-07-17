import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getReceiptUrl } from "@airswap/utils";

import Icon from "../Icon/Icon";
import { Label, Link } from "./TransactionLink.style";

type TransactionLinkProps = {
  hideLabel?: boolean;
  chainId: number;
  hash: string;
  className?: string;
};

const TransactionLink = ({
  hideLabel = false,
  chainId,
  hash,
  className = "",
}: TransactionLinkProps) => {
  const { t } = useTranslation();
  const receiptUrl = useMemo(
    () => getReceiptUrl(chainId, hash),
    [chainId, hash]
  );

  return (
    <Link
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={t("wallet.transactionLink")}
      href={receiptUrl}
    >
      {!hideLabel && <Label>{t("wallet.transactionLink")}</Label>}
      <Icon iconSize={1} name="transaction-link" />
    </Link>
  );
};

export default TransactionLink;
