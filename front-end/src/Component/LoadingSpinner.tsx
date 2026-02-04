type LoadingSpinnerProps = {
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
  ariaLabel?: string;
};

const LoadingSpinner = ({
  size = 22,
  thickness = 3,
  color = "#0f172a",
  className,
  ariaLabel = "Loading",
}: LoadingSpinnerProps) => {
  const spinnerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `${thickness}px solid rgba(15, 23, 42, 0.15)`,
    borderTopColor: color,
    animation: "relay-spin 0.8s linear infinite",
    boxSizing: "border-box",
    display: "inline-block",
  };

  return (
    <span className={className} aria-label={ariaLabel} role="status">
      <span style={spinnerStyle} />
      <style>{`
        @keyframes relay-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
};

export default LoadingSpinner;
