import SUPPORTED_WALLET_PROVIDERS, {
  AbstractConnector,
} from "../../constants/supportedWalletProviders";
import Button from "../Button/Button";

export type WalletProviderListProps = {
  onProviderSelected: (connector: AbstractConnector) => void;
};

const WalletProviderList = ({
  onProviderSelected,
}: WalletProviderListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {SUPPORTED_WALLET_PROVIDERS.map((provider) => (
        <Button
          key={provider.name}
          intent="neutral"
          onClick={() => {
            onProviderSelected(provider.getConnector());
          }}
        >
          <div className="flex gap-2 items-center pr-2">
            <img
              src={provider.logo}
              alt={`${provider.name} logo`}
              className="w-12 h-12"
            />
            <span className="flex-1">{provider.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default WalletProviderList;
