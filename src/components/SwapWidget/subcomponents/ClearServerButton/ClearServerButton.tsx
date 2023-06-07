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
 * @remarks - when clicked, this button sets serverUrl in Redux to null, then changes search history
 * @returns
 */
const ClearServerButton = () => {
  const serverUrl = useAppSelector(selectServerUrl);
  const dispatch = useAppDispatch();

  const history = useHistory();

  const handleClearServerUrl = () => {
    dispatch(setServerUrl(null));

    let location = history.location;
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("serverUrl");
    history.push({
      ...location,
      search: searchParams.toString(),
    });
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
