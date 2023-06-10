import React, { FC } from "react";

import { useAppSelector } from "../../../../app/hooks";
import { selectServerUrl } from "../../../../features/userSettings/userSettingsSlice";
import {
  ClearCustomServerButton,
  ClearServerButtonText,
} from "./ClearServerButton.styles";

interface ClearServerButtonProps {
  handleClearServerUrl: () => void;
}

/**
 * @remarks when clicked, this button sets serverUrl in Redux to null, then changes search history
 * @returns button that runs `handleClearServerUrl when clicked
 */
const ClearServerButton: FC<ClearServerButtonProps> = ({
  handleClearServerUrl,
}) => {
  const serverUrl = useAppSelector(selectServerUrl);

  return (
    <ClearCustomServerButton
      hasServerUrl={!!serverUrl}
      onClick={() => handleClearServerUrl()}
    >
      <ClearServerButtonText>Clear custom server</ClearServerButtonText>
    </ClearCustomServerButton>
  );
};

export default ClearServerButton;
