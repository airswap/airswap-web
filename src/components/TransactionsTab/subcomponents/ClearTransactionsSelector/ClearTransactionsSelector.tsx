import React, { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useToggle } from "@react-hookz/web";

import { useAppDispatch } from "../../../../app/hooks";
import { SubmittedTransaction } from "../../../../features/transactions/transactionsSlice";
import { ClearOrderType } from "../../../../types/clearOrderType";
import { SelectOption } from "../../../Dropdown/Dropdown";
import getClearTransactionOptions from "../../helpers/getClearTransactionOptions";
import {
  Container,
  StyledDropdown,
  ClearListButton,
  ClearListButtonTooltip,
} from "./ClearTransactionsSelector.styles";

type ClearTransactionSelectorType = {
  address: string;
  chainId: number;
  transactions: SubmittedTransaction[];
  onChange: (value: ClearOrderType) => void;
  className?: string;
};

const ClearTransactionsSelector: FC<ClearTransactionSelectorType> = ({
  address,
  chainId,
  transactions,
  onChange,
  className,
}) => {
  const dispatch = useAppDispatch();
  const [
    isClearTransactionsDropdownOpen,
    toggleIsClearTransactionsDropdownOpen,
  ] = useToggle(false);
  const [hideTooltip, setHideTooltip] = useState(false);
  const { t } = useTranslation();

  const options = useMemo(() => {
    return getClearTransactionOptions();
  }, [t]);

  const [selectedOption, setSelectedOption] = useState(options[1]);

  const handleChange = (option: SelectOption) => {
    setSelectedOption(option);
    onChange(option.value as ClearOrderType);
  };

  const handleClearListButtonClick = () => {
    toggleIsClearTransactionsDropdownOpen();
    setHideTooltip(true);
  };

  return (
    <Container className={className}>
      <ClearListButton
        icon="bin"
        onBlur={() => toggleIsClearTransactionsDropdownOpen(false)}
        onClick={handleClearListButtonClick}
      />
      {!hideTooltip && (
        <ClearListButtonTooltip>
          {t("wallet.clearTransactions")}
        </ClearListButtonTooltip>
      )}
      {isClearTransactionsDropdownOpen && (
        <StyledDropdown
          isMenuOpen
          selectedOption={selectedOption}
          options={options}
          onChange={handleChange}
        />
      )}
    </Container>
  );
};

export default ClearTransactionsSelector;
