import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { sanitizeInput } from "../../../../../helpers/string";
import {
  ButtonsContainer,
  Container,
  StyledButton,
  StyledInput,
} from "./EditApprovalModal.styles";

type EditApprovalModalProps = {
  editApprovalAmount: string | null;
  onCloseButtonClick: () => void;
  onUpdateButtonClick: (value: string) => void;
};

const EditApprovalModal: FC<EditApprovalModalProps> = ({
  editApprovalAmount,
  onCloseButtonClick,
  onUpdateButtonClick,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("0");

  const handleUpdateButtonClick = () => {
    onUpdateButtonClick(value);
  };

  useEffect(() => {
    setValue(editApprovalAmount || "");
  }, [editApprovalAmount]);

  return (
    <Container>
      <StyledInput
        hideLabel
        label="Approval amount"
        placeholder="0"
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        minLength={1}
        maxLength={79}
        spellCheck={false}
        value={value}
        onChange={(e) => {
          setValue(sanitizeInput(e.currentTarget.value) || value);
        }}
      />
      <ButtonsContainer>
        <StyledButton onClick={onCloseButtonClick}>
          {t("common.back")}
        </StyledButton>
        <StyledButton onClick={handleUpdateButtonClick}>
          {t("common.update")}
        </StyledButton>
      </ButtonsContainer>
    </Container>
  );
};

export default EditApprovalModal;
