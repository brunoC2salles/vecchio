import type { SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement>;

/** Chama de forno a lenha, traço único, estilo desenhado à mão */
export function FlameDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 100 140" fill="none" {...props}>
      <path
        d="M50 8c6 14-10 18-10 32 0 8 7 12 7 20 0-10 12-14 12-26 0-9-8-11-8-20 10 6 20 22 20 40 0 26-19 46-21 66-2-14-27-30-27-58 0-16 9-24 9-38 0-8-4-12-4-18 8 2 16 10 22 2z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Espiga de trigo — método verace */
export function WheatDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 80 140" fill="none" {...props}>
      <path d="M40 132V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {[24, 40, 56, 72, 88].map((y) => (
        <g key={y}>
          <path
            d={`M40 ${y} C 22 ${y - 6}, 14 ${y + 4}, 12 ${y + 16}`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={`M40 ${y + 8} C 58 ${y + 2}, 66 ${y + 12}, 68 ${y + 24}`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path d="M40 18c-6-6-6-12 0-16 6 4 6 10 0 16z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

/** Bola de impasto sobre a bancada */
export function DoughDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 140 100" fill="none" {...props}>
      <path
        d="M70 20c26 0 46 16 46 36S96 84 70 84 24 76 24 56 44 20 70 20z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M46 44c4-6 10-8 16-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 38c6 2 10 8 8 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 84h116" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Pá napoletana (schiaffo) */
export function PeelDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 160 60" fill="none" {...props}>
      <path
        d="M8 30c0-12 12-20 26-20h30c10 0 16 8 16 18v4c0 10-6 18-16 18H34C20 50 8 42 8 30z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M80 30h72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Fatia de pizza, contorno simples */
export function SliceDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <path
        d="M50 10 L88 88 Q50 100 12 88 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="46" r="4" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="62" r="4" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="38" cy="68" r="4" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}
