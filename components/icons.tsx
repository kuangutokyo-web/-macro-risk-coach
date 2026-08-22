import type { SVGProps } from "react";

export function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" aria-hidden="true"><path d="M5 29.5 14.5 20l6 6L35 11.5"/><path d="M25 11.5h10v10"/></svg>;
}

export function Arrow(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...props}><path d="M4 10h12M11 5l5 5-5 5"/></svg>;
}

export function Clock(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...props}><circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/></svg>;
}

export function Check(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...props}><path d="m4 10 4 4 8-9"/></svg>;
}

export function Spark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...props}><path d="M10 2c.7 4.5 3 6.8 7 8-4 1.2-6.3 3.5-7 8-.7-4.5-3-6.8-7-8 4-1.2 6.3-3.5 7-8Z"/></svg>;
}
