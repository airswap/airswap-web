import React, { FC } from "react";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectServerURL,
  setServerURL,
} from "../../../../features/userSettings/userSettingsSlice";
import {
  ClearCustomServerButton,
  ClearServerButtonText,
} from "./ClearServerButton.styles";

type ClearServerButtonProps = {
  serverUrl: string | null;
};

const ClearServerButton: FC<ClearServerButtonProps> = ({ serverUrl }) => {
  const dispatch = useAppDispatch();
  const serverURL = useAppSelector(selectServerURL);

  return (
    <ClearCustomServerButton
      hasServerUrl={!!serverUrl}
      onClick={() => {
        // TODO: figure out why serverURL is not clearing
        dispatch(setServerURL(null));
        console.log(serverURL);
      }}
    >
      <ClearServerButtonText>Clear custom server</ClearServerButtonText>
    </ClearCustomServerButton>
  );
};

export default ClearServerButton;
