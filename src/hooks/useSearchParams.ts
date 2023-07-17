const useSearchParams = (value: string): string | null => {
  const searchParams = location.href.split("?")[1];

  if (!searchParams) {
    return null;
  }

  const query = new URLSearchParams(`?${searchParams}`);

  return query.get(value);
};

export default useSearchParams;
