import Icon from "../../../Icon/Icon";
import { Link } from "./WalletLink.styles";

type WalletLinkProps = {
  chainId: number;
  address: string;
};

const addressMapping: Record<number, string> = {
  1: "",
  4: "rinkeby.",
};

const WalletLink = ({ chainId, address }: WalletLinkProps) => {
  return (
    <Link
      target="_blank"
      rel="noreferrer"
      href={`https://${addressMapping[chainId]}etherscan.io/address/${address}`}
    >
      <Icon iconSize={1} name="wallet-link" />
    </Link>
  );
};

export default WalletLink;
