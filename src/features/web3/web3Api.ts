import { ConnectionType } from "../../web3-connectors/connections";

const LAST_PROVIDER_LOCAL_STORAGE_KEY = "airswap/lastConnectedProvider";

export const saveLastProviderToLocalStorage = (type: ConnectionType) => {
  localStorage.setItem(LAST_PROVIDER_LOCAL_STORAGE_KEY, type);
};

export const clearLastProviderFromLocalStorage = () => {
  localStorage.setItem(LAST_PROVIDER_LOCAL_STORAGE_KEY, "");
};

export const getLastProviderFromLocalStorage = ():
  | ConnectionType
  | undefined => {
  const type = localStorage.getItem(LAST_PROVIDER_LOCAL_STORAGE_KEY);

  if (!type) {
    return undefined;
  }

  return type as ConnectionType;
};
