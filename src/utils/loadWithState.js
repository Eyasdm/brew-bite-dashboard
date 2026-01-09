export async function loadWithState({
  loader,
  setData,
  setLoading,
  setError,
  errorMessage = "Something went wrong",
}) {
  try {
    setError?.("");
    setLoading?.(true);

    const result = await loader();
    setData?.(result);

    return result;
  } catch (e) {
    setError?.(e?.message || errorMessage);
    throw e;
  } finally {
    setLoading?.(false);
  }
}
