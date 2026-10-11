import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
export function OutArrow({ size = 17 }: { size?: number }) {
  return <ArrowUpRight size={size} strokeWidth={1.5} aria-hidden="true" />;
}
export function DownArrow() {
  return <ArrowDown size={17} strokeWidth={1.5} aria-hidden="true" />;
}
export function RightArrow() {
  return <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />;
}
