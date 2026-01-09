export default function Spinner({ size = 48 }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full border-4 border-border border-t-primary"
        style={{
          width: size,
          height: size,
        }}
        aria-label="Loading"
      />
    </div>
  );
}
