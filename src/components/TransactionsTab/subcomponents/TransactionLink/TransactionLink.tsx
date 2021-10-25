import {getEtherscanURL} from "@airswap/utils";

import Icon from "../../../Icon/Icon";
import {Link} from "./TransactionLink.style";

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
  return (
    <Link
      className={className}
      target="_blank"
      rel="noreferrer"
      href={`${getEtherscanURL(chainId, hash)}`}
    >
        <Icon iconSize={1} name="transaction-link" />
    </Link>
  );

};

export default TransactionLink;
