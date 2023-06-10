import { useLocation } from "react-router-dom";

const useSearchParams = (value: string): string | null => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return query.get(value);
};

export default useSearchParams;
