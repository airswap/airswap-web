import { FC, ReactElement, useMemo } from "react";

import { getAccountUrl } from "@airswap/utils";

import truncateEthAddress from "truncate-eth-address";

import { Link, StyledIcon } from "./WalletLink.styles";

interface WalletLinkProps {
  address: string;
  chainId: number;
  className?: string;
}

const WalletLink: FC<WalletLinkProps> = ({
  address,
  chainId,
  className = "",
}): ReactElement => {
  const truncatedAddress = useMemo(
    () => truncateEthAddress(address),
    [address]
  );

  return (
    <Link
      className={className}
      target="_blank"
      rel="noreferrer"
      href={`${getAccountUrl(chainId, address)}`}
    >
      {`(${truncatedAddress})`}
      <StyledIcon iconSize={1} name="transaction-link" />
    </Link>
  );
};

export default WalletLink;
