import React from "react";
import { useHistory } from "react-router";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectServerUrl,
  setServerUrl,
} from "../../../../features/userSettings/userSettingsSlice";
import {
  ClearCustomServerButton,
  ClearServerButtonText,
} from "./ClearServerButton.styles";

/**
 * @remarks when clicked, this button sets serverUrl in Redux to null, then changes search history
 * @returns button that runs `handleClearServerUrl when clicked
 */
const ClearServerButton = () => {
  const dispatch = useAppDispatch();
  const serverUrl = useAppSelector(selectServerUrl);

  const history = useHistory();
  let location = history.location;

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
