// TODO: filter for transactions
export const clearLocalStorage = () => {
  const filteredTransactions = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("airswap/transactions")) {
      console.log(key)
      // localStorage.removeItem(key);
    }
  }
};
