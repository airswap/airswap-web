import { useContext } from "react";
import useKonami from "react-use-konami";

import { InterfaceContext } from "../../../contexts/interface/Interface";

const useQuotesDebug = () => {
  const { setIsDebugMode } = useContext(InterfaceContext);

  useKonami(
    () => {
      setIsDebugMode(true);
    },
    {
      code: ["d", "e", "b", "u", "g"],
    }
  );
};

export default useQuotesDebug;
