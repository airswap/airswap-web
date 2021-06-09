const LAST_ACCOUNT_LOCAL_STORAGE_KEY = `airswap/lastConnectedAccount`;

const saveLastAccount = (address: string) => {
  localStorage.setItem(LAST_ACCOUNT_LOCAL_STORAGE_KEY, address);
};

const clearLastAccount = () => {
  localStorage.setItem(LAST_ACCOUNT_LOCAL_STORAGE_KEY, "");
};

const loadLastAccount = () => {
  return localStorage.getItem(LAST_ACCOUNT_LOCAL_STORAGE_KEY) || null;
};

const hasPreviouslyConnected = () => {
  return loadLastAccount() != null;
};

export {
  hasPreviouslyConnected as browserHasPreviouslyConnected,
  saveLastAccount,
  clearLastAccount,
};
