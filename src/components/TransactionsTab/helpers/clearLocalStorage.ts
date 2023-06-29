export const clearLocalStorage = (address: string) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes(`airswap/transactions/${address}`)) {
      localStorage.removeItem(key);
    }
  }
};
