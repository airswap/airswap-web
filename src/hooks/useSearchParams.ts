import { Location } from "history";

/**
 *
 * @param location takes in the return value of useLocation hook from react-router-dom
 * @returns query string or null
 */
const useSearchParams = (location: Location): string | null => {
  const query = new URLSearchParams(location.search);
  const serverURL = query.get("serverURL");
  return serverURL;
};

export default useSearchParams;
