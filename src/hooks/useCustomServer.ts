import { useAppDispatch } from "../app/hooks";
import { setCustomServerUrl } from "../features/userSettings/userSettingsSlice";
import useSearchParams from "./useSearchParams";
import { useEffect } from "react";

const useCustomServer = (): void => {
  const dispatch = useAppDispatch();
  const serverUrl = useSearchParams("serverUrl");

  useEffect(() => {
    if (serverUrl) {
      dispatch(setCustomServerUrl(serverUrl));
    }
  }, [serverUrl]);
};

export default useCustomServer;
