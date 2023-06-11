import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { setServerUrl } from "../features/userSettings/userSettingsSlice";
import useSearchParams from "./useSearchParams";

const useCustomServer = (): void => {
  const dispatch = useAppDispatch();
  const serverUrl = useSearchParams("serverUrl");

  useEffect(() => {
    if (serverUrl) {
      dispatch(setServerUrl(serverUrl));
    }
  }, [serverUrl]);
};

export default useCustomServer;
