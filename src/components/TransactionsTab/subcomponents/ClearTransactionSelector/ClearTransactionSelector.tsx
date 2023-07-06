import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../../../app/hooks";
import {
  setTransactions,
  SubmittedTransaction,
} from "../../../../features/transactions/transactionsSlice";
import useHistoricalTransactions from "../../../../features/transactions/useHistoricalTransactions";
import { SelectOption } from "../../../Dropdown/Dropdown";
import {
  clearAllTransactions,
  clearFailedTransactions,
} from "../../helpers/clearLocalStorage";
import getClearTransactionOptions from "../../helpers/getClearTransactionOptions";
import { getFitleredFailedTransactions } from "../../helpers/getFitleredFailedTransactions";
import {
  SelectWrapper,
  StyledDropdown,
  StyledTooltip,
} from "./ClearTransactionSelector.styles";

type ClearTransactionSelectorType = {
  address: string;
  chainId: number;
  transactions: SubmittedTransaction[];
  isTooltip: boolean;
  isSelectorOpen: boolean;
  setIsSelectorOpen: Dispatch<SetStateAction<boolean>>;
};

const ClearTransactionSelector = ({
  address,
  chainId,
  transactions,
  isTooltip,
  isSelectorOpen,
  setIsSelectorOpen,
}: ClearTransactionSelectorType) => {
  const selectWrapperRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const historicalTransactions = useHistoricalTransactions();
  console.log(historicalTransactions);

  const translatedOptions = useMemo(() => {
    return getClearTransactionOptions(t);
  }, [t]);

  const [unit, setUnit] = useState(translatedOptions[1]);

  const handleClearAllTransactions = () => {
    dispatch(setTransactions(null));
    clearAllTransactions(address, chainId);
  };

  const handleClearFailedTransactions = () => {
    const filteredTransactions = getFitleredFailedTransactions(transactions);
    dispatch(setTransactions({ all: filteredTransactions }));
    clearFailedTransactions(address, chainId);
  };

  const handleClearTypeChange = (option: SelectOption) => {
    setUnit(option);
    setIsSelectorOpen(false);
    if (option.value === "All") {
      handleClearAllTransactions();
    } else if (option.value === "Failed") {
      handleClearFailedTransactions();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSelectorOpen) {
        if (
          selectWrapperRef.current &&
          !selectWrapperRef.current.contains(event.target as Node)
        ) {
          setIsSelectorOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSelectorOpen, setIsSelectorOpen]);

  return (
    <>
      <StyledTooltip $isSelectorOpen={isSelectorOpen} $isTooltip={isTooltip}>
        {t("wallet.clearList")}
      </StyledTooltip>
      <SelectWrapper $isOpen={isSelectorOpen} ref={selectWrapperRef}>
        <StyledDropdown
          selectedOption={unit}
          options={translatedOptions}
          onChange={handleClearTypeChange}
        />
      </SelectWrapper>
    </>
  );
};

export default ClearTransactionSelector;
