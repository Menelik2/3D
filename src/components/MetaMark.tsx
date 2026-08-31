/** META Pictures monogram — red geometric + white M, transparent (no black plate) */
export function MetaMark({
  className = "",
  title = "META Pictures",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Red geometric mark — tall stem + upper triangle + lower wing */}
      <path
        fill="#e11d48"
        d="M28 88
           L28 18
           L52 2
           L72 28
           L48 48
           L48 58
           L68 78
           L48 96
           L28 88
           Z"
      />
      <path
        fill="#e11d48"
        d="M8 72
           L28 48
           L28 88
           L40 88
           L18 96
           Z"
      />
      {/* White M */}
      <path
        fill="#ffffff"
        d="M58 96
           L58 42
           L74 68
           L90 32
           L90 96
           L80 96
           L80 56
           L74 68
           L68 56
           L68 96
           Z"
      />
    </svg>
  );
}
