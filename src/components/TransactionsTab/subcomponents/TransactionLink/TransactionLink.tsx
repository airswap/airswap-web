import { useTranslation } from "react-i18next";

import { getEtherscanURL } from "@airswap/utils";

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

  return (
    <Link
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={t("wallet.transactionLink")}
      href={`${getEtherscanURL(chainId, hash)}`}
    >
      <Icon iconSize={1} name="transaction-link" />
    </Link>
  );
};

export default TransactionLink;
