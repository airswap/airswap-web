import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getReceiptUrl } from "@airswap/utils";

import { Label, Link, StyledIcon } from "./TransactionLink.style";

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
      <StyledIcon iconSize={1} name="transaction-link" />
      {!hideLabel && <Label>{t("wallet.transactionLink")}</Label>}
    </Link>
  );
};

export default TransactionLink;
