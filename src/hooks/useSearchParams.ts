import { Location } from "history";

import { useAppDispatch } from "../app/hooks";
import { setServerURL } from "../features/userSettings/userSettingsSlice";

/**
 * @remarks captures query string and passes it into userSettingsSlice Redux store
 * @param location takes in the return value of useLocation hook from react-router-dom
 * @returns query string or null
 */
const useSearchParams = (location: Location): void => {
  const query = new URLSearchParams(location.search);
  const queryString = query.get("serverURL");

  const dispatch = useAppDispatch();
  dispatch(setServerURL(queryString));
};

export default useSearchParams;
