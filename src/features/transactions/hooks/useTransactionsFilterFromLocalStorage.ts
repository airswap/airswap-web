import { useEffect } from "react";

import { useLocalStorageValue } from "@react-hookz/web/esm";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectTransactionsFilter,
  setFilters,
  TransactionsState,
} from "../transactionsSlice";
import { getTransactionsFilterLocalStorageKey } from "../transactionsUtils";

const useTransactionsFilterFromLocalStorage = () => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useAppSelector((state) => state.web3);

  const filterFromStore = useAppSelector(selectTransactionsFilter);

  const [filter, setFilter] = useLocalStorageValue<TransactionsState["filter"]>(
    getTransactionsFilterLocalStorageKey(account || "-", chainId || 1),
    {},
    { handleStorageEvent: false }
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
        (value, index) => filterFromStoreValues[index] === value
      )
    ) {
      return;
    }

    dispatch(setFilters(filter));
  }, [filter]);
};

export default useTransactionsFilterFromLocalStorage;
