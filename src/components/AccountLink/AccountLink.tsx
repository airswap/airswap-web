import Icon from "../Icon/Icon";
import { Link } from "./AccountLink.style";
import { getAccountUrl } from "@airswap/utils";
import React from "react";
import { useTranslation } from "react-i18next";

type AccountLinkProps = {
  chainId: number;
  address: string;
  className?: string;
};

const AccountLink = ({
  chainId,
  address,
  className = "",
}: AccountLinkProps) => {
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

export default AccountLink;
