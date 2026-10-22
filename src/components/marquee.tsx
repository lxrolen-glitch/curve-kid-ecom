import { Asterisk } from "lucide-react";

export default function Marquee({
  items,
  fast = false,
  className = "",
}: {
  items: string[];
  fast?: boolean;
  className?: string;
}) {
  const content = (
    <>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-6 whitespace-nowrap">
          <span>{item}</span>
          <Asterisk size={20} className="shrink-0 opacity-70" />
        </li>
      ))}
    </>
  );
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <ul
        className={`flex w-max items-center gap-6 ${
          fast ? "animate-marquee-fast" : "animate-marquee"
        }`}
      >
        {content}
        {content}
      </ul>
    </div>
  );
}
