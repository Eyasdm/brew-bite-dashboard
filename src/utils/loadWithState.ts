interface LoadWithStateOptions<T> {
  loader: () => Promise<T>;
  setData?: (data: T) => void;
  setLoading?: (loading: boolean) => void;
  setError?: (error: string) => void;
  errorMessage?: string;
}

export async function loadWithState<T>({
  loader,
  setData,
  setLoading,
  setError,
  errorMessage = "Something went wrong",
}: LoadWithStateOptions<T>): Promise<T> {
  try {
    setError?.("");
    setLoading?.(true);

    const result = await loader();
    setData?.(result);

    return result;
  } catch (e) {
    setError?.((e instanceof Error ? e.message : null) || errorMessage);
    throw e;
  } finally {
    setLoading?.(false);
  }
}
