import { useCallback, useEffect, useState } from "react";


export function useApi(fetcher, deps = [], options = {}) {
  const [data, setData] = useState(options.initialData ?? null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetcher();
      setData(response);
      return response;
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail ?? requestError?.response?.data?.error ?? "Unable to load data.";
      setError(typeof detail === "string" ? detail : "Unable to load data.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, reload: load, setData };
}
