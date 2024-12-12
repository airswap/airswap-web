import React, { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import { getAccountUrl } from "@airswap/utils";

import Icon from "../Icon/Icon";
import { Link } from "./AccountLink.style";

interface AccountLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  chainId: number;
  address: string;
  className?: string;
}

const AccountLink = ({
  chainId,
  address,
  className = "",
  ...props
}: AccountLinkProps) => {
  const { t } = useTranslation();

  return (
    <Link
      {...props}
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
