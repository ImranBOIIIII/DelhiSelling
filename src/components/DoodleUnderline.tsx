interface DoodleUnderlineProps {
  className?: string;
}

export default function DoodleUnderline({ className = "" }: DoodleUnderlineProps) {
  return (
    <svg
      className={`w-full h-3 ${className}`}
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8C20 4 40 10 60 6C80 2 100 9 120 5C140 1 160 8 180 6C185 5.5 190 6 198 7"
        stroke="#FCD34D"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
