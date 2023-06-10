import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  ClearCustomServerButton,
  ClearServerButtonText,
} from "./ClearServerButton.styles";

interface ClearServerButtonProps {
  serverUrl: string | null;
  handleClearServerUrl: () => void;
}

/**
 * @remarks when clicked, this button sets serverUrl in Redux to null, then changes search history
 * @params serverUrl - value from Redux. Path: SwapWidget --> InfoSection --> ClearServerButton
 * @params handleClearServerUrl - Function that runs Dispatch, which sets serverUrl to `null`. Path: SwapWidget --> InfoSection --> ClearServerButton
 * @returns button that runs `handleClearServerUrl when clicked
 */
const ClearServerButton: FC<ClearServerButtonProps> = ({
  serverUrl,
  handleClearServerUrl,
}) => {
  const { t } = useTranslation();
  return (
    <ClearCustomServerButton
      hasServerUrl={!!serverUrl}
      onClick={() => handleClearServerUrl()}
    >
      <ClearServerButtonText>
        {t("orders.clearCustomServer")}
      </ClearServerButtonText>
    </ClearCustomServerButton>
  );
};

export default ClearServerButton;
