import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getTransactionsFilterLocalStorageKey } from "./transactionUtils";
import {
  selectTransactionsFilter,
  setFilters,
  TransactionsState,
} from "./transactionsSlice";
import { useLocalStorageValue } from "@react-hookz/web/esm";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

const useTransactionsFilterFromLocalStorage = () => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useWeb3React();
  const filterFromStore = useAppSelector(selectTransactionsFilter);

  const [filter, setFilter] = useLocalStorageValue<TransactionsState["filter"]>(
    getTransactionsFilterLocalStorageKey(account || "-", chainId || 1),
    {},
    { handleStorageEvent: false },
  );

  useEffect(() => {
    setFilter(filterFromStore);
  }, [filterFromStore]);

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    const filterFromStoreValues = Object.values(filterFromStore);
    const filterFromLocalStorageValues = Object.values(filter);

    if (
      filterFromLocalStorageValues.every(
        (value, index) => filterFromStoreValues[index] === value,
      )
    ) {
      return;
    }

    dispatch(setFilters(filter));
  }, [filter]);
};

export default useTransactionsFilterFromLocalStorage;
