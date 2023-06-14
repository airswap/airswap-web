import { useTranslation } from "react-i18next";

import { getReceiptUrl } from "@airswap/utils";

import Icon from "../../../Icon/Icon";
import { Link } from "./TransactionLink.style";

type TransactionLinkProps = {
  chainId: number;
  hash: string;
  className?: string;
};

const TransactionLink = ({
  chainId,
  hash,
  className = "",
}: TransactionLinkProps) => {
  const { t } = useTranslation();

  console.log(getReceiptUrl(43114, ""))

  return (
    <Link
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={t("wallet.transactionLink")}
      href={`${getReceiptUrl(chainId, hash)}`}
    >
      <Icon iconSize={1} name="transaction-link" />
    </Link>
  );
};

export default TransactionLink;
