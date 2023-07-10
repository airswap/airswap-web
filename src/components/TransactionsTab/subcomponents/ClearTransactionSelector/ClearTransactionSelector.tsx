import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  setTransactions,
  SubmittedTransaction,
  transactionsSlice,
} from "../../../../features/transactions/transactionsSlice";
import useHistoricalTransactions from "../../../../features/transactions/useHistoricalTransactions";
import { SelectOption } from "../../../Dropdown/Dropdown";
import {
  clearAllTransactions,
  clearFailedTransactions,
} from "../../helpers/clearLocalStorage";
import getClearTransactionOptions from "../../helpers/getClearTransactionOptions";
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

  const handleClearTypeChange = (option: SelectOption) => {
    setUnit(option);
    setIsSelectorOpen(false);
    if (option.value === "All") {
      clearAllTransactions({ address, chainId, dispatch });
    } else if (option.value === "Failed") {
      clearFailedTransactions({ address, chainId, transactions, dispatch });
    }
  };

  return (
    <>
      <StyledTooltip $isSelectorOpen={isSelectorOpen} $isTooltip={isTooltip}>
        {t("wallet.clearTransactions")}
      </StyledTooltip>
      <SelectWrapper $isOpen={isSelectorOpen} ref={selectWrapperRef}>
        <StyledDropdown
          selectedOption={unit}
          options={translatedOptions}
          onChange={handleClearTypeChange}
          setIsSelectorOpen={setIsSelectorOpen}
          isMenuOpen
        />
      </SelectWrapper>
    </>
  );
};

export default ClearTransactionSelector;
