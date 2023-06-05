import React from "react";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectServerURL,
  setServerURL,
} from "../../../../features/userSettings/userSettingsSlice";
import {
  ClearCustomServerButton,
  ClearServerButtonText,
} from "./ClearServerButton.styles";

const ClearServerButton = () => {
  const serverURL = useAppSelector(selectServerURL);
  const dispatch = useAppDispatch();

  const handleClearServerUrl = () => {
    dispatch(setServerURL(null));
  };

  return (
    <ClearCustomServerButton
      hasServerUrl={!!serverURL}
      onClick={() => handleClearServerUrl()}
    >
      <ClearServerButtonText>Clear custom server</ClearServerButtonText>
    </ClearCustomServerButton>
  );
};

export default ClearServerButton;
