import type { SVGProps } from "react";

const paths = {
  "arrow-up-left": "M17 17 7 7M7 17V7h10",
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "arrow-left": "M19 12H5m7-7-7 7 7 7",
  "arrow-right": "M5 12h14m-7-7 7 7-7 7",
  "arrow-down": "M12 5v14m-7-7 7 7 7-7",
  "chevron-left": "m15 18-6-6 6-6",
  "chevron-right": "m9 18 6-6-6-6",
  "menu": "M4 7h16M4 12h16M4 17h16",
  "close": "m6 6 12 12M6 18 18 6",
  "check": "m5 12 4 4L19 6",
  "plus": "M12 5v14M5 12h14",
  "minus": "M5 12h14",
  "pen": "m14 4 6 6M4 20l4-1 12-12a2.83 2.83 0 0 0-4-4L4 15l-1 6 6-1M3 21l5-5",
  "code": "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20",
  "layout": "M4 3h16v18H4zM4 9h16M10 9v12M7 6h.01M10 6h.01",
  "spark": "m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z",
  "mail": "M3 5h18v14H3zM3 5l9 8 9-8",
  "globe": "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z",
  "pin": "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "clock": "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  "loader": "M21 12a9 9 0 1 1-6.2-8.55",
} as const;

export type IconName = keyof typeof paths;
export function Icon({ name, size = 22, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
export function Mark({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}><g stroke="currentColor" strokeWidth="10"><path d="M32 4v56M4 32h56M12.2 12.2l39.6 39.6M12.2 51.8l39.6-39.6" /></g></svg>;
}
export function Star({ className = "" }: { className?: string }) {
  return <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" /></svg>;
}
