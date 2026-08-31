/** META Pictures monogram — red geometric + white M, transparent background */
export function MetaMark({
  className = "",
  title = "META Pictures",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Red geometric mark */}
      <path
        fill="#e11d48"
        d="M8 78 L8 42 L32 18 L48 38 L32 52 L32 78 Z"
      />
      <path
        fill="#e11d48"
        d="M32 18 L58 2 L78 28 L52 48 L32 52 Z"
      />
      <path
        fill="#e11d48"
        d="M8 78 L32 52 L52 48 L70 68 L48 92 L32 78 Z"
      />
      <path
        fill="#e11d48"
        d="M2 62 L8 52 L8 78 L22 78 Z"
      />
      {/* White M */}
      <path
        fill="#ffffff"
        d="M62 92 L62 38 L84 68 L106 28 L106 92 L94 92 L94 52 L84 68 L74 52 L74 92 Z"
      />
    </svg>
  );
}
