import Link from "next/link";

type Props = {
  href: string;
  isActive: boolean;
  children?: React.ReactNode;
};

export function NextLink({ href, isActive, children }: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "border-purple-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {children}
    </Link>
  );
}
