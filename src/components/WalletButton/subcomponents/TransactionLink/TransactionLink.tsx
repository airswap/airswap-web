import { getEtherscanURL } from "@airswap/utils";

import Icon from "../../../Icon/Icon";
import { Link } from "./TransactionLink.style";

type TransactionLinkProps = {
  chainId: number;
  hash: string;
};

const TransactionLink = ({ chainId, hash }: TransactionLinkProps) => {
  return (
    <Link
      target="_blank"
      rel="noreferrer"
      href={`${getEtherscanURL(chainId, hash)}`}
    >
      <Icon iconSize={0.75} name="transaction-link" />
    </Link>
  );
};

export default TransactionLink;
