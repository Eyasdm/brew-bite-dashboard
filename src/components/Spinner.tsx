interface SpinnerProps {
  size?: number;
}

export default function Spinner({ size = 48 }: SpinnerProps) {
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
