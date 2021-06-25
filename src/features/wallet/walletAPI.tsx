import SUPPORTED_WALLET_PROVIDERS, {
  WalletProvider,
} from "../../constants/supportedWalletProviders";

const LAST_ACCOUNT_LOCAL_STORAGE_KEY = `airswap/lastConnectedAccount`;

const saveLastAccount = (address: string, provider: WalletProvider) => {
  localStorage.setItem(
    LAST_ACCOUNT_LOCAL_STORAGE_KEY,
    `${provider.name}/${address}`
  );
};

const clearLastAccount = () => {
  localStorage.setItem(LAST_ACCOUNT_LOCAL_STORAGE_KEY, "");
};

const loadLastAccount = () => {
  try {
    const storedString = localStorage.getItem(LAST_ACCOUNT_LOCAL_STORAGE_KEY);
    if (!storedString) throw new Error("No connected accounts saved");
    const [providerName, address] = storedString.split("/");
    const provider = SUPPORTED_WALLET_PROVIDERS.find(
      (p) => p.name === providerName
    );
    if (!provider) throw new Error(`Could not find provider: ${providerName}`);
    return {
      provider,
      address,
    };
  } catch (e) {
    return null;
  }
};

export { loadLastAccount, saveLastAccount, clearLastAccount };
