import Link from "next/link"

type Props = {
  href: string;
  isActive: boolean;
  children?: React.ReactNode;
};

export function NextLink({ href, isActive, children }: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center border-b-2 px-1 pt-1 text-base font-normal transition-colors duration-200 ${
        isActive
          ? "border-transparent text-slate-500"
          : "hover:border-primary/50 border-transparent text-slate-300 hover:text-slate-500"
      }`}
    >
      {children}
    </Link>
  )
}
