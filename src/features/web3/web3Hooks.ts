import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setShowConnectModal } from "./web3Slice";

export const useWeb3 = (): void => {
  const dispatch = useAppDispatch();

  const { isActive, isInitialized, userHasClosedConnectModal } = useAppSelector(
    (state) => state.web3
  );

  useEffect(() => {
    if (isInitialized && !isActive && !userHasClosedConnectModal) {
      dispatch(setShowConnectModal(true));
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized && isActive) {
      dispatch(setShowConnectModal(false));
    }
  }, [isActive]);
};
