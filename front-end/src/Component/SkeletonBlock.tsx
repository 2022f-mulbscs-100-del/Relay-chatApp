type SkeletonBlockProps = {
  width?: number | string;
  height?: number | string;
  radius?: number;
  className?: string;
};

const SkeletonBlock = ({
  width = "100%",
  height = 14,
  radius = 10,
  className,
}: SkeletonBlockProps) => {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: radius,
    background: "linear-gradient(90deg, rgba(226,232,240,0.7) 0%, rgba(241,245,249,0.9) 50%, rgba(226,232,240,0.7) 100%)",
    backgroundSize: "200% 100%",
    animation: "relay-shimmer 1.2s ease-in-out infinite",
  };

  return (
    <div className={className} style={style} aria-hidden="true">
      <style>{`
        @keyframes relay-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonBlock;
