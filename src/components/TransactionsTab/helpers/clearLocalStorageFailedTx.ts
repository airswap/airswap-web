export const clearLocalStorageFailedTx = (address: string) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const localStorageKey = `airswap/transactions/${address}`
    if (key?.includes(localStorageKey)) {
      const keysWithTransactions = localStorage.getItem(key)
      if (keysWithTransactions) {
        const objectKeys = JSON.parse(keysWithTransactions);
        const orders = objectKeys.all;
        const filteredOrders = orders.filter((order: any) => {
          return order.status !== 'failed'
        });
        const updatedKeys = JSON.stringify({ all: filteredOrders })

        localStorage.setItem(key, updatedKeys);
      }
    }
  }
};
