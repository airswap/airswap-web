import React from "react";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectServerUrl,
  setServerUrl,
} from "../../../../features/userSettings/userSettingsSlice";
import {
  ClearCustomServerButton,
  ClearServerButtonText,
} from "./ClearServerButton.styles";

const ClearServerButton = () => {
  const serverUrl = useAppSelector(selectServerUrl);
  const dispatch = useAppDispatch();

  const handleClearServerUrl = () => {
    dispatch(setServerUrl(null));
  };

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
