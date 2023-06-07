import { Location } from "history";

const useSearchParams = (location: Location): string | null => {
  const query = new URLSearchParams(location.search);
  let serverUrl = query.get("serverUrl");
  return serverUrl;
};

export default useSearchParams;
